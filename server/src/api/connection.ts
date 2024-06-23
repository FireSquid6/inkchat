import { Elysia, t } from "elysia"
import { kitPlugin } from "@/api"
import { getResponse } from "@/processor"
import { clientMessages, parseMessage, serverMessages } from "@/protocol"
import type { Kit } from "@/index"
import type { Message } from "@/protocol"


export const SOCKET_PATH = "/socket"

// this could be anything. A channel is needed to enable the pubsub pattern
const wsChannelName = "communication"

export const connectionApi = (app: Elysia) => app
  .use(kitPlugin)
  .state("socketIdToUserId", new Map<string, string>())
  .ws(SOCKET_PATH, {
    body: t.String(),
    message: async (ws, message) => {
      console.log(`Received message: ${message}`)

      let response = ""
      let error = ""

      try {
        const msg = parseMessage(message)
        const res = await processMessage(ws.data.store.kit, ws.id, ws.data.store.socketIdToUserId, msg)

        response = res.response
        error = res.error
      } catch (e) {
        response = ""
        error = `Caught message processing error: ${e as string}`
      }

      // you would think that publish would send it to every subscriber, but it sends it to every subscriber but the current client
      if (response != "") {
        ws.send(response)
        ws.publish(wsChannelName, response)
      }
      if (error != "") {
        ws.send(serverMessages.error.make(error))
      }
    },

    close: (ws) => {
      ws.data.store.socketIdToUserId.delete(ws.id)
      // not sure if this is necessary but it can't hurt
      ws.unsubscribe(wsChannelName)
    }
  })


async function processMessage(kit: Kit, wsId: string, socketIdToUserId: Map<string, string>, msg: Message): Promise<{ response: string, error: string }> {
  if (msg.kind === clientMessages.connect.name) {
    const payload = clientMessages.connect.payloadAs(msg)
    const { auth } = kit

    const session = auth.readBearerToken(payload.authorization)

    if (!session) {
      return { response: "", error: "Invalid authorization" }
    }

    const { user } = await auth.validateSession(session)

    if (!user) {
      return { response: "", error: "Invalid authorization" }
    }

    socketIdToUserId.set(wsId, user.id)
    return { response: serverMessages.userJoined.make({ id: user.id }), error: "" }
  }

  const userId = socketIdToUserId.get(wsId)

  if (!userId) {
    return { response: "", error: "User not authenticated" }
  }

  const data = await getResponse(kit, msg, userId!)
  return data
}
