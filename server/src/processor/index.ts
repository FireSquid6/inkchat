import type { Kit } from "@/index"
import { doForMessage, clientMessages, serverMessages, type Message } from "@/protocol"
import { channelTable, messageTable } from "@/schema"
import { eq } from "drizzle-orm"
import { generateIdFromEntropySize } from "lucia"

export async function getResponse(kit: Kit, msg: Message, senderId: string): Promise<{ response: string, error: string }> {
  const { db } = kit

  let response = ""
  let error = ""

  await doForMessage(msg, new Map([
    [clientMessages.chat.name, async (msg) => {
      const payload = clientMessages.chat.payloadAs(msg)
      const channels = await db.select().from(channelTable).where(eq(channelTable.id, payload.channelId))
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
        createdAt: Date.now(),
      }
      // TODO: what if this fails?
      await db.insert(messageTable).values(message)

      response = serverMessages.newChat.make(message)
    }],
  ]))

  return { response: response, error: error }
}
