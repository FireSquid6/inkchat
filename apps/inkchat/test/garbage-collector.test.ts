import { collectGarbage } from "@/db/garbage-collector"
import { joincodeTable, sessionTable } from "@/db/schema"
import { testApp } from "@/testutils"
import { test, expect } from "bun:test"



test("garbage collector", async () => {
  const kit = testApp()
  const { db } = kit
  await db.insert(joincodeTable).values([{
    id: "testjoincode",
    createdAt: Date.now(),
    expiresAt: Date.now() - 1000,
    isAdmin: 0,
  }, {
    id: "testjoincode2",
    createdAt: Date.now(),
    expiresAt: Date.now() + 10000,
    isAdmin: 1,
  }])

  await db.insert(sessionTable).values([{
    id: "testsession",
    userId: "testuser",
    expiresAt: Date.now() - 1000,
  }, {
    id: "testsession2",
    userId: "testuser",
    expiresAt: Date.now() + 10000,
  }])


  await collectGarbage(kit)

  const joincodes = await db.select().from(joincodeTable)
  expect(joincodes.length).toBe(1)
  expect(joincodes[0].id).toBe("testjoincode2")

  const sessions = await db.select().from(sessionTable)
  expect(sessions.length).toBe(1)
  expect(sessions[0].id).toBe("testsession2")
})
