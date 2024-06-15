import { test, expect } from "bun:test";
import { testApp } from "@/testutils";
import { sessionTable, userTable } from "@/schema";
import { eq } from "drizzle-orm"


test("signup and signin flow", async () => {
  // TODO: 
  // - session cookie is returned
  // - session is created
  // - session can be destroyed
  // - new session can be created by logging in

  const { api, db } = testApp()

  // create a new account
  const res = await api.auth.signup.post({
    username: "testuser",
    password: "teStp@ssw0rd"
  });

  expect(res.status).toBe(200)
  expect(res.data?.token).toBeDefined()

  const userResult = await db.select().from(userTable).where(eq(userTable.username, "testuser"))
  expect(userResult.length).toBe(1)

  const sessionResult = await db.select().from(sessionTable).where(eq(sessionTable.userId, userResult[0].id))
  expect(sessionResult.length).toBe(1)
  expect(sessionResult[0].id).toBe(res.data?.token!)

  const res2 = await api.auth.logout.post({}, {
    headers: {
      Authorization: `Bearer ${res.data?.token}`
    }
  })

  // log out
  expect(res2.status).toBe(200)
  expect(res2.data?.message).toBe("Logged out. All sessions invalidated.")

  const sessionResult2 = await db.select().from(sessionTable).where(eq(sessionTable.userId, userResult[0].id))
  expect(sessionResult2.length).toBe(0)


  // log in
  const res3 = await api.auth.login.post({
    username: "testuser",
    password: "teStp@ssw0rd"
  })
})
