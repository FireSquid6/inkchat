import { channelTable, messageTable } from "@/schema"
import { getTestUser, testApp } from "@/testutils"
import { test, expect } from "bun:test"
import { faker } from "@faker-js/faker"


test("channels routes", async () => {
  const { api, db } = testApp()
  const { user, session } = await getTestUser(db)

  // seed the database with channels
  const channels = [{
    id: faker.string.uuid(),
    name: "General",
    description: "General chat",
    createdAt: Date.now(),
  }, {
    id: faker.string.uuid(),
    name: "Random",
    description: "Random chat",
    createdAt: Date.now(),
  }, {
    id: faker.string.uuid(),
    name: "Secret",
    description: "Secret chat",
    createdAt: Date.now(),
  }]


  // generate 400 random messages for each channel
  // we don't actually care if the userIds mean anything for this test
  const messages = []
  for (const channel of channels) {
    for (let i = 0; i < 400; i++) {
      messages.push({
        id: faker.string.uuid(),
        userId: faker.string.uuid(),
        content: faker.lorem.paragraph(),
        createdAt: Date.now(),
        channelId: channel.id,
      })
    }
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


})
