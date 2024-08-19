import { expect, test } from "bun:test"
import { testApp, getTestUser } from "@/testutils"
import { joincodeTable } from "@/db/schema"


test("joincode listing, creation, and deletion", async () => {
  const { db, api } = testApp()
  const { session, user } = await getTestUser(db)


  // TODO - test that normal users can't access this endpoint
  const createRes = await api.admin.joincode.post({}, {
    headers: {
      Authorization: `Bearer ${session.id}`,
    }
  })

  expect(createRes.status).toBe(201)

  const joincodes = await api.admin.joincode.get({
    headers: {
      Authorization: `Bearer ${session.id}`,
    }
  })

  expect(joincodes.data).not.toBeNull()

  const dbJoincodes = await db.select().from(joincodeTable)

  expect(joincodes.data).toEqual(dbJoincodes)

  const deleteRes = await api.admin.joincode.delete({
    // @ts-expect-error typescript doesn't know that we already checked using an expect
    code: joincodes.data[0].id
  }, {
    headers: {
      Authorization: `Bearer ${session.id}`,
    }
  })

  expect(deleteRes.status).toBe(200)

  const joincodesAfterDelete = await api.admin.joincode.get({
    headers: {
      Authorization: `Bearer ${session.id}`,
    }
  })

  expect(joincodesAfterDelete.data).toEqual([])
})
