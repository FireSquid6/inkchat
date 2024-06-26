import { test, expect } from "bun:test";
import { getTestUser, testApp } from "@/testutils";
import { sessionTable, userTable } from "@/db/schema";
import { eq } from "drizzle-orm"


test("signup and signin flow", async () => {
  // TODO: 
  // - session cookie is returned
  // - session is created
  // - session can be destroyed
  // - new session can be created by logging in

  const { api, db } = testApp()
  const { user, session } = await getTestUser(db)
  console.log(user)

  // new code
  const codeRes = await api.admin.joincode.post({}, {
    headers: {
      Authorization: `Bearer ${session}`
    }
  })

  if (!codeRes.data?.code) {
    console.log(codeRes)
    throw new Error("No code returned")
  }

  // create a new account
  const res = await api.auth.signup.post({
    username: "testuser",
    password: "teStp@ssw0rd",
    code: codeRes.data?.code,
  });

  expect(res.status).toBe(200)
  expect(res.data?.token).toBeDefined()

  const userResult = await db.select().from(userTable).where(eq(userTable.username, "testuser"))
  expect(userResult.length).toBe(1)

  const sessionResult = await db.select().from(sessionTable).where(eq(sessionTable.userId, userResult[0].id))
  expect(sessionResult.length).toBe(1)
  expect(sessionResult[0].id).toBe(res.data?.token!)

  const res2 = await api.auth.signout.post({}, {
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
  const res3 = await api.auth.signin.post({
    username: "testuser",
    password: "teStp@ssw0rd"
  })

  expect(res3.status).toBe(200)
  expect(res3.data?.token).toBeDefined()

  const sessionResult3 = await db.select().from(sessionTable).where(eq(sessionTable.userId, userResult[0].id))
  expect(sessionResult3.length).toBe(1)
  expect(sessionResult3[0].id).toBe(res3.data?.token!)
})
