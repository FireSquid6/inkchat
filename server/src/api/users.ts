import { Elysia, t } from "elysia"
import { kitPlugin } from "@/api"
import { userTable } from "@/schema";
import { eq } from "drizzle-orm";


// TODO: allow the user to set their own information
// bio, display name, etc
export const usersApi = (app: Elysia) => app
  .use(kitPlugin)
  .get("/users/:id", async (ctx) => {
    const { db } = ctx.store.kit
    const users = await db.select().from(userTable).where(eq(userTable.id, ctx.params.id))

    if (users.length === 0) {
      ctx.set.status = 404
      return {
        message: "User not found"
      }
    }

    return users[0]
  }, {
    params: t.Object({
      id: t.String()
    })
  })
  .get("/users", async (ctx) => {
    const { db } = ctx.store.kit
    const users = await db.select().from(userTable)
    return users
  })
