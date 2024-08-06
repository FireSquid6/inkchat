import { Elysia, t } from "elysia"
import {
  doForMessage,
  clientMessages,
  serverMessages,
  parseMessage,
  type Message
} from "protocol"
import { channelTable, messageTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import { generateIdFromEntropySize } from "lucia"
import { kitPlugin } from "@/api"
import type { Kit } from "@/index"
import { canCreateChannel } from "@/permissions"
import { makeChannel } from "@/db/channels"
import { isNone } from "maybe"

export const SOCKET_PATH = "/socket"

// this could be anything. A channel is needed to enable the pubsub pattern
const wsChannelName = "communication"

export const connectionApi = (app: Elysia) =>
  app
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
          const res = await processMessage(
            ws.data.store.kit,
            ws.id,
            ws.data.store.socketIdToUserId,
            msg
          )

          response = res.response
          error = res.error

          if (res.subscribe) {
            ws.subscribe(wsChannelName)
          }
        } catch (e) {
          response = ""
          error = `Caught message processing error: ${e as string}`
        }

        // you would think that publish would send it to every subscriber, but it sends it to every subscriber but the current client
        if (response != "") {
          console.log(`Sending response: ${response}`)
          ws.send(response)
          ws.publish(wsChannelName, response)
        }

        if (error != "") {
          console.log(`Sending error: ${response}`)
          ws.send(serverMessages.error.make(error))
        }
      },

      close: (ws) => {
        ws.data.store.socketIdToUserId.delete(ws.id)
        ws.unsubscribe(wsChannelName)
      }
    })

// we just let ws be any because we don't care that much
async function processMessage(
  kit: Kit,
  wsId: string,
  socketIdToUserId: Map<string, string>,
  msg: Message
): Promise<{ response: string; error: string; subscribe: boolean }> {
  if (msg.kind === clientMessages.connect.name) {
    if (socketIdToUserId.has(wsId)) {
      return {
        response: "",
        error: "You're already connected. Chill out. Everything is fine.",
        subscribe: false
      }
    }

    const payload = clientMessages.connect.payloadAs(msg)
    const { auth } = kit

    const session = auth.readBearerToken(payload.authorization)

    if (!session) {
      return { response: "", error: "Invalid authorization", subscribe: false }
    }

    const { user } = await auth.validateSession(session)

    if (!user) {
      return { response: "", error: "Invalid authorization", subscribe: false }
    }

    socketIdToUserId.set(wsId, user.id)
    // TODO: make the client subscribe
    return {
      response: serverMessages.userJoined.make({ id: user.id }),
      error: "",
      subscribe: true
    }
  }

  const userId = socketIdToUserId.get(wsId)

  if (!userId) {
    return { response: "", error: "User not authenticated", subscribe: false }
  }

  const data = await getResponse(kit, msg, userId!)
  return {
    response: data.response,
    error: data.error,
    subscribe: false
  }
}

export async function getResponse(
  kit: Kit,
  msg: Message,
  senderId: string
): Promise<{ response: string; error: string }> {
  const { db } = kit

  let response = ""
  let error = ""

  await doForMessage(
    msg,
    new Map([
      [
        clientMessages.chat.name,
        async (msg) => {
          const payload = clientMessages.chat.payloadAs(msg)
          const channels = await db
            .select()
            .from(channelTable)
            .where(eq(channelTable.id, payload.channelId))
          if (channels.length === 0) {
            error = "Channel not found"
            return
          }

          const messageId = generateIdFromEntropySize(32)
          const message = {
            id: messageId,
            userId: senderId,
            channelId: payload.channelId,
            content: payload.content,
            createdAt: Date.now()
          }
          // TODO: what if this fails?
          await db.insert(messageTable).values(message)

          response = serverMessages.newChat.make(message)
        }
      ],
      [
        clientMessages.createChannel.name,
        async (msg) => {
          const payload = clientMessages.createChannel.payloadAs(msg)
          
          if (!canCreateChannel(kit, senderId)) {
            error = "User doesn't have permission to create a channel"
            return
          }

          // TODO - validate inputs
          

          const result = await makeChannel(kit, payload.name, payload.description)

          if (isNone(result)) {
            error = "Failed to create channel"
            return
          }
          
          response = serverMessages.createChannel.make(result.data)
        }
      ]
    ])
  )

  return { response: response, error: error }
}
