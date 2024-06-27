import { Elysia, t } from "elysia"
import { kitPlugin } from "."
import { joincodeTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import { promoteUser } from "@/db/user"
import { None, Some, isNone } from "@/index"
import { deleteJoincode, makeJoincode } from "@/db/auth"


export const adminApi = (app: Elysia) => app
  .use(kitPlugin)
  .post("/admin/promote", async (ctx) => {
    const { userId } = ctx.body

    const { error } = await promoteUser(ctx.store.kit, userId)

    if (error) {
      ctx.set.status = 400
      return None(error)
    }

    return Some(undefined)
  }, {
    body: t.Object({
      userId: t.String()
    })
  })
  .post("/admin/joincode", async (ctx) => {
    const { data: joincode, error } = await makeJoincode(ctx.store.kit)

    if (error) {
      ctx.set.status = 500
      return None(error)
    }

    ctx.set.status = 201
    return Some(joincode)
  })
  .delete("/admin/joincode", async (ctx) => {
    const { code } = ctx.body

    const deletedMaybe = await deleteJoincode(ctx.store.kit, code)
    if (isNone(deletedMaybe)) {
      ctx.set.status = 400
      return deletedMaybe
    }

    ctx.set.status = 200
    return deletedMaybe
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
