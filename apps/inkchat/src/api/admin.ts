import { Elysia, t } from "elysia"
import { kitPlugin } from "."
import { joincodeTable } from "@/db/schema"
import { promoteUser } from "@/db/user"
import { isNone } from "maybe"
import { deleteJoincode, makeJoincode } from "@/db/auth"

// TODO - allow the user to create joincodes that are admin
export const adminApi = (app: Elysia) =>
  app
    .use(kitPlugin)
    .post(
      "/admin/promote",
      async (ctx) => {
        const { userId } = ctx.body

        const { error } = await promoteUser(ctx.store.kit, userId)

        if (error) {
          return ctx.error(400, { message: "user not found" })
        }

        return {}
      },
      {
        body: t.Object({
          userId: t.String()
        })
      }
    )
    .post("/admin/joincode", async (ctx) => {
      const joincodeRes = await makeJoincode(ctx.store.kit)

      if (isNone(joincodeRes)) {
        return ctx.error(500, { message: joincodeRes.error })
      }

      ctx.set.status = 201
      return {
        code: joincodeRes.data,
        message: "Joincode created"
      }
    })
    .delete(
      "/admin/joincode",
      async (ctx) => {
        const { code } = ctx.body

        const deletedMaybe = await deleteJoincode(ctx.store.kit, code)
        if (isNone(deletedMaybe)) {
          return ctx.error(404, deletedMaybe)
        }

        ctx.set.status = 200
        return deletedMaybe
      },
      {
        body: t.Object({
          code: t.String()
        })
      }
    )
    .get("/admin/joincode", async (ctx) => {
      const { db } = ctx.store.kit
      const joincodes = await db.select().from(joincodeTable)
      return joincodes
    })
