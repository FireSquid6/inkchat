import { channelTable, messageTable } from "@/db/schema"
import { Connection } from "@/sdk"
import { getTestUser, testApp } from "@/testutils"
import { test, expect } from "bun:test"
import { clientMessages, parseMessage, serverMessages } from "protocol"
import { converse } from "@/testutils"
import { eq } from "drizzle-orm"
import { validateChannelName } from "@/db/channels"

test("channels routes", async () => {
  const { api, db } = testApp()
  const { session } = await getTestUser(db)

  // seed the database with channels
  const channels = [
    {
      id: "1",
      name: "General",
      description: "General chat",
      createdAt: Date.now()
    },
    {
      id: "2",
      name: "Random",
      description: "Random chat",
      createdAt: Date.now()
    },
    {
      id: "3",
      name: "Secret",
      description: "Secret chat",
      createdAt: Date.now()
    }
  ]

  const messages = []

  // just a quick veritifcation of our assumption that the current unix time is not in the 70s
  if (Date.now() <= 50) {
    throw new Error("You are in the 70s. What happened?")
  }

  let j = 0
  for (const channel of channels) {
    for (let i = 0; i < 50; i++) {
      messages.push({
        id: i.toString() + j.toString(),
        // we don't actually care if the userIds mean anything for this test
        userId: "someuser",
        content: "lorem ipsum",
        // this means that messages[0] will be the newest message while messages[399] will be the oldest
        createdAt: Date.now() - i,
        channelId: channel.id
      })
    }
    j += 1
  }

  await db.insert(channelTable).values(channels)
  await db.insert(messageTable).values(messages)

  const channelsRes = await api.channels.get({
    headers: {
      Authorization: `Bearer ${session.id}`
    }
  })
  expect(channelsRes.status).toBe(200)
  expect(channelsRes.data).toEqual(channels)

  const channelRes = await api.channels({ id: channels[0].id }).get({
    headers: {
      Authorization: `Bearer ${session.id}`
    }
  })
  expect(channelRes.status).toBe(200)
  expect(channelRes.data).toEqual(channels[0])

  const expectedMessages = []

  for (const message of messages) {
    if (message.channelId === channels[0].id) {
      expectedMessages.push(message)
    }
  }
  expectedMessages.sort((a, b) => a.createdAt - b.createdAt)

  const messagesRes = await api.channels({ id: channels[0].id }).messages.get({
    headers: {
      Authorization: `Bearer ${session.id}`
    },
    query: {
      last: "5",
      before: Date.now().toString()
    }
  })

  expect(messagesRes.status).toBe(200)
  expect(messagesRes.data).toEqual(expectedMessages.slice(0, 5))
})

test("channel routes with sdk", async () => {
  const { db } = testApp()
  const { session } = await getTestUser(db)

  const connection = new Connection("localhost:3001", session.id)
  await new Promise<void>((resolve) => {
    connection.stateChanged.subscribe((state) => {
      if (state.successful) {
        resolve()
      }
      if (state.error) {
        throw new Error(state.error)
      }
    })
  })

  // seed the database with channels
  const channels = [
    {
      id: "1",
      name: "General",
      description: "General chat",
      createdAt: Date.now()
    },
    {
      id: "2",
      name: "Random",
      description: "Random chat",
      createdAt: Date.now()
    },
    {
      id: "3",
      name: "Secret",
      description: "Secret chat",
      createdAt: Date.now()
    }
  ]
  await db.insert(channelTable).values(channels)

  const [ foundChannels, error ] = await connection.getAllChannels()

  if (error) {
    throw new Error(error)
  }

  expect(foundChannels).toEqual(channels)
})


test("create, modify, and delete channels", async () => {
  const { api, db } = testApp()
  const { user, session } = await getTestUser(db)
  // initialize a channel

  let doneEverything = false
  await new Promise<void>((resolve) => {
    const socket = api.socket.subscribe()

    socket.on("error", (err) => {
      console.error(err)
      // if the test is failing here it's because the socket is erroring for some reason
      socket.close()
      resolve()
    })
    socket.on("close", () => {
      resolve()
    })
    socket.on("open", async () => {
      const messages: string[] = [
        clientMessages.connect.make({
          authorization: `Bearer ${session.id}`
        }),
        clientMessages.createChannel.make({
          name: "testchannel",
          description: "Test Channel"
        })
      ]
      const responses = await converse(socket, messages)

      const connectResponse = parseMessage(responses[0])
      expect(connectResponse.kind).toBe("USER_JOINED")
      const connectPayload =
        serverMessages.userJoined.payloadAs(connectResponse)

      expect(connectPayload.id).toBe(user.id)

      const newChannel = parseMessage(responses[1])
      expect(newChannel.kind).toBe(serverMessages.channelCreated.name)
      const newChannelPayload = serverMessages.channelCreated.payloadAs(newChannel)

      expect(newChannelPayload.name).toBe("testchannel")
      expect(newChannelPayload.description).toBe("Test Channel")

      const channels = await db
        .select()
        .from(channelTable)
        .where(eq(channelTable.name, "testchannel"))

      expect(channels.length).toBe(1)

      doneEverything = true
      socket.close()
    })
  })

  // if the test is failing here it's because the socket is being shut down
  expect(doneEverything).toBe(true)
})


test("validate channel name", () => {
  expect(validateChannelName("")).toBe(false)
  expect(validateChannelName("a")).toBe(true)
  expect(validateChannelName("a".repeat(50))).toBe(true)
  expect(validateChannelName("a".repeat(51))).toBe(false)
  expect(validateChannelName("a b")).toBe(false)
})
