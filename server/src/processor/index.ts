import type { Kit } from "@/index"
import {  doForMessage, expectChatPayload, expectConnectPayload, makeMessage, parseMessage } from "@/protocol"
import type { ClientMessageKind, UserJoinedPayload } from "@/protocol"
import { channelTable, messageTable } from "@/schema"
import { eq } from "drizzle-orm"
import { generateIdFromEntropySize, type User } from "lucia"

// right now the ws just echos back
export class MessageProcessor {
  private clients: Map<string, User> = new Map()

  // TODO: better error handling. If it's an error, we should only send the response message to the client that sent it
  async processMessage(kit: Kit, message: string, senderId: string): Promise<{ response: string, error: string }> {
    const { auth, db } = kit
    const msg = parseMessage(message)

    let response = ""
    let error = ""

    await doForMessage<ClientMessageKind>(msg, new Map([
      ["CONNECT", async (msg) => {
        const payload = expectConnectPayload(msg)
        const session = auth.readBearerToken(`Bearer ${payload.token}`)
        
        if (!session) {
          error = "Invalid session token"
          return
        }

        const { user } = await auth.validateSession(session)
        if (!user) {
          error = "Invalid session token"
          return
        }

        this.clients.set(senderId, user)
        response = makeMessage<UserJoinedPayload>("USER_JOINED", {
          id: user.id,
        })
        return
      }],
      ["CHAT", async (msg) => {
        const userId = this.clients.get(senderId)?.id
        if (!userId) {
          error = "Client has not authenticated yet."
          return
        }
        const payload = expectChatPayload(msg)

        const channels = await db.select().from(channelTable).where(eq(channelTable.id, payload.channelId))
        if (channels.length === 0) {
          error = "Channel not found"
          return
        }

        const messageId = generateIdFromEntropySize(32)
        const message = {
          id: messageId,
          userId: userId,
          channelId: payload.channelId,
          content: payload.content,
          createdAt: Date.now(),
        }
        await db.insert(messageTable).values(message)

        response = makeMessage("CHAT", message, serverId)
      }],
      ["UNKOWN", (msg) => {
        error = `Unkown message kind: ${msg.kind}`
        return
      }]
    ]))

    return { response: response, error: error }
  }

  removeClient(id: string) {
    this.clients.delete(id)
  }
}

