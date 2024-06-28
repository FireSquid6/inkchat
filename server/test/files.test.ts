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

  expect(res.status).toBe(201)
  expect(res.data).toBeDefined()

  const attachment = await api.attachments({ filename: res.data || "" }).get({
    headers: {
      Authorization: `Bearer ${session.id}`
    }
  })
  console.log(attachment)
  
  const file = attachment.data
  console.log(typeof file)
  console.log("file: ", file)

  if (file === null) {
    return expect(file).not.toBe(null)
  }
  expect(attachment.status).toBe(200)
  // @ts-ignore for some reason the file is a string
  expect(file).toBe("foo")
})
