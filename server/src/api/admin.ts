import { Elysia, t } from "elysia"
import { kitPlugin } from "."
import { joincodeTable, userTable } from "@/db/schema"
import { eq } from "drizzle-orm"


export const adminApi = (app: Elysia) => app
  .use(kitPlugin)
  .post("/admin/promote", async (ctx) => {
    const { userId } = ctx.body
    const { db } = ctx.store.kit

    await db.update(userTable).set({ isAdmin: 1 }).where(eq(userTable.id, userId))

    ctx.set.status = 201
    return { message: "User promoted" }
  }, {
    body: t.Object({
      userId: t.String()
    })
  })
  .post("/admin/joincode", async (ctx) => {
    const { db } = ctx.store.kit
    const joincode = Math.random().toString(36).substring(7)

    await db.insert(joincodeTable).values({
      id: joincode,
      createdAt: Date.now()
    })

    ctx.set.status = 201
    return {
      code: joincode
    }
  })
  .delete("/admin/joincode", async (ctx) => {
    const { db } = ctx.store.kit
    const { code } = ctx.body

    await db.delete(joincodeTable).where(eq(joincodeTable.id, code))
  }, {
    body: t.Object({
      code: t.String()
    })
  })
  .get("/admin/joincode", async (ctx) => {
    const { db } = ctx.store.kit
    const joincodes = await db.select().from(joincodeTable)
    return joincodes
  })
