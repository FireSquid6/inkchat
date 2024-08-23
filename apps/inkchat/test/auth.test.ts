import { test, expect } from "bun:test"
import { getTestUser, testApp } from "@/testutils"
import { userTable } from "@/db/schema"
import { eq } from "drizzle-orm"

test("signup and signin flow", async () => {
  const { api, db } = testApp()
  const { session } = await getTestUser(db)

  // new code
  const codeRes = await api.admin.joincode.post(
    {},
    {
      headers: {
        Authorization: `Bearer ${session.id}`
      }
    }
  )

  if (!codeRes.data?.code || codeRes.data?.code === "") {
    console.log(codeRes.data?.message)
    console.log(codeRes.error?.value)
    throw new Error("No code returned")
  }

  // this should fail!
  const failedRes = await api.auth.signup.post({
    username: "notrealperson",
    password: "teStp@ssw0rd",
    code: "1234567890",  // too long to even be a joincode so that 
  })

  expect(failedRes.status).toBe(400)

  // create a new account
  const res = await api.auth.signup.post({
    username: "testuser1",
    password: "teStp@ssw0rd",
    code: codeRes.data?.code
  })

  expect(res.status).toBe(201)
  expect(res.data?.token).toBeDefined()

  const userResult = await db
    .select()
    .from(userTable)
    .where(eq(userTable.username, "testuser"))
  expect(userResult.length).toBe(1)

  const res2 = await api.auth.signout.post(
    {},
    {
      headers: {
        Authorization: `Bearer ${res.data?.token}`
      }
    }
  )

  // log out
  expect(res2.status).toBe(200)
  expect(res2.data?.message).toBe("Logged out. All sessions invalidated.")

  // log in
  const res3 = await api.auth.signin.post({
    username: "testuser1",
    password: "teStp@ssw0rd"
  })

  expect(res3.status).toBe(201)
  expect(res3.data?.token).toBeDefined()
})
