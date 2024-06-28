import { channelTable, messageTable } from "@/db/schema"
import { getTestUser, testApp } from "@/testutils"
import { test, expect } from "bun:test"


test("channels routes", async () => {
  const { api, db } = testApp()
  const { session } = await getTestUser(db)

  // seed the database with channels
  const channels = [{
    id: "1",
    name: "General",
    description: "General chat",
    createdAt: Date.now(),
  }, {
    id: "2",
    name: "Random",
    description: "Random chat",
    createdAt: Date.now(),
  }, {
    id: "3",
    name: "Secret",
    description: "Secret chat",
    createdAt: Date.now(),
  }]



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
        channelId: channel.id,
      })
    }
    j += 1
  }

  console.log(messages)

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


  console.log(channels[0].id)
  const messagesRes = await api.channels({ id: channels[0].id}).messages.get({
    headers: {
      Authorization: `Bearer ${session.id}`
    },
    query: {
      last: "5",
      before: Date.now().toString(),
    }
  })

  expect(messagesRes.status).toBe(200)
  expect(messagesRes.data).toEqual(expectedMessages.slice(0, 5))
})
