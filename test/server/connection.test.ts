import { expectNewMessagePayload, expectUserJoinedPayload, makeMessage, parseMessage } from "@/protocol";
import type { ConnectPayload, ChatPayload } from "@/protocol";
import { channelTable, messageTable } from "@/schema";
import { converse, testApp, getTestUser } from "@/testutils";
import { test, expect } from "bun:test";
import { eq } from "drizzle-orm";


test("chat flow", async () => {
  const { api, db } = testApp()
  const { user, session } = await getTestUser(db)
  // initialize a channel

  await db.insert(channelTable).values({
    id: "testchannel",
    name: "Test Channel",
    description: "Test channel",
    createdAt: Date.now(),
  })


  await new Promise<void>((resolve) => {
    const socket = api.socket.subscribe()
    socket.on("error", (err) => {
      console.error(err)
      // if the test is failing here it's because the socket is erroring for some reason
      expect(err).toBeUndefined()
      socket.close()
    })
    socket.on("close", () => {
      socket.close()
      resolve()
    })
    socket.on("open", async () => {
      const messages: string[] = [
        makeMessage<ConnectPayload>("CONNECT", {
          token: session.id
        }),
        makeMessage<ChatPayload>("CHAT", {
          channelId: "testchannel",
          content: "Hello, world!"
        })
      ]

      const responses = await converse(socket, messages)
      socket.close()

      const connectResponse = parseMessage(responses[0])
      expect(connectResponse.kind).toBe("USER_JOINED")
      const connectPayload = expectUserJoinedPayload(connectResponse)
      expect(connectPayload.id).toBe(user.id)

      const newMessage = parseMessage(responses[1])
      expect(newMessage.kind).toBe("NEW_MESSAGE")
      const newMessagePayload = expectNewMessagePayload(newMessage)

      expect(newMessagePayload.content).toBe("Hello, world!")
      expect(newMessagePayload.channelId).toBe("testchannel")
      const chatMessages = await db.select().from(messageTable).where(eq(messageTable.channelId, "testchannel"))
      expect(chatMessages.length).toBe(1)


      resolve()
    })
  })
})
