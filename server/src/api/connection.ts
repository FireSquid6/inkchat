import { Elysia, t } from "elysia"
import { kitPlugin } from "@/api"
import { processMessage } from "@/processor"
import { serverMessages } from "@/protocol"

export const SOCKET_PATH = "/socket"

// this could be anything. A channel is needed to enable the pubsub pattern
const wsChannelName = "communication"

export const connectionApi = (app: Elysia) => app
  .use(kitPlugin)
  .state("socketIdToUserId", new Map<string, string>())
  .ws(SOCKET_PATH, {
    body: t.String(),
    upgrade: (ctx) => {
      const headers: Record<string, string> = {
        "authorization": ctx.request.headers.get("authorization") ?? "",
      }
      return headers
    },
    open: (ws) => {
      console.log(ws)
      const user = ws.data.user
      console.log(`User connected: ${user?.id}`)
      if (!user) {
        ws.close()
        return
      }

      ws.data.store.socketIdToUserId.set(ws.id, user.id)
    },
    message: async (ws, message) => {
      ws.data.log.info(`Received message: ${message}`)

      let response = ""
      let error = ""

      try {
        const data = await processMessage(ws.data.store.kit, message, ws.id)
        response = data.response
        error = data.error
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
