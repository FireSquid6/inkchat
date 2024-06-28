import { getTestUser, testApp } from "@/testutils"
import { expect, test } from "bun:test"


test("files api", async () => {
  const { api, db } = testApp()
  const { session } = await getTestUser(db)

  const filename = "mycoolfile.txt"

  const res = await api.attachments.post({
    filename,
    file: new File(["foo"], filename, {
      type: "text/plain"
    })
  }, {
    headers: {
      Authorization: `Bearer ${session.id}`
    }
  })

  console.log(res.data)
  expect(res.status).toBe(201)
  expect(res.data).toBeDefined()
})
