import { Elysia, t } from "elysia"
import { kitPlugin } from "@/api"
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";


export interface PublicUser {
  id: string
  username: string
  isAdmin: boolean
}

// TODO: allow the user to set their own information
// bio, display name, etc
export const usersApi = (app: Elysia) => app
  .use(kitPlugin)
  .get("/users/:id", async (ctx): Promise<PublicUser | null > => {
    const { db } = ctx.store.kit
    const users = await db.select().from(userTable).where(eq(userTable.id, ctx.params.id))

    if (users.length === 0) {
      ctx.set.status = 404
      return null
    }

    const user = users[0]
    return {
      id: user.id,
      username: user.id,
      isAdmin: user.isAdmin === 1
    }
  }, {
    params: t.Object({
      id: t.String()
    })
  })
  .get("/users", async (ctx): Promise<string[]> => {
    const { db } = ctx.store.kit
    const users = await db.select().from(userTable)
    const userIds = users.map(user => user.id)

    return userIds
  })
