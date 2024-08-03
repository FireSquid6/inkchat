import { userTable } from "@/db/schema"
import { getTestUser, testApp } from "@/testutils"
import { expect, test } from "bun:test"

test("users route", async () => {
  const { db, api } = testApp()
  const { session, user } = await getTestUser(db)

  const users = [{
    id: "1",
    username: "testuser1",
    password: "testpassword",
  },
  {
    id: "2",
    username: "testuser2",
    password: "testpassword",
  },
  {
    id: "3",
    username: "testuser3",
    password: "testpassword",
  }]

  await db.insert(userTable).values(users)
  // add the test user
  users.unshift(user)

  const publicUsers = users.map((user) => {
    return {
      id: user.id,
      username: user.username,
      isAdmin: false
    }
  })
  publicUsers[0].isAdmin = true

  const userRes = await api.users.get({
    headers: {
      Authorization: `Bearer ${session.id}`
    }
  })
  expect(userRes.status).toBe(200)
  expect(userRes.data).toEqual(publicUsers)


  // test whoami
  const res = await api.whoami.get({
    headers: {
      Authorization: `Bearer ${session.id}`
    }
  })

  expect(res.status).toBe(200)
  expect(res.data).toEqual({
    id: user.id,
    username: "testuser",
    isAdmin: true,
  })
})

