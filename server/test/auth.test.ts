import { test, expect } from "bun:test";
import { testApp } from "@/testutils";
import { userTable } from "@/schema";
import { eq } from "drizzle-orm"


test("signup and signin flow", async () => {
  // TODO: 
  // - session cookie is returned
  // - session is created
  // - session can be destroyed
  // - new session can be created by logging in
  
  const { api, db } = testApp()

  const res = await api.auth.signup.post({
    username: "testuser",
    password: "teStp@ssw0rd"
  });

  expect(res.status).toBe(200)

  const dbResult = await db.select().from(userTable).where(eq(userTable.username, "testuser"))
  expect(dbResult.length).toBe(1)
})
