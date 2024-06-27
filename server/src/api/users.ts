import { Elysia, t } from "elysia"
import { kitPlugin } from "@/api"
import type { Maybe } from "@/index"
import { Some, None } from "@/index"
import { getAllUsers, getUserWithId } from "@/db/user";


export interface PublicUser {
  id: string
  username: string
  isAdmin: boolean
}

// TODO: allow the user to set their own information
// bio, display name, etc
export const usersApi = (app: Elysia) => app
  .use(kitPlugin)
  .get("/users/:id", async (ctx): Promise<Maybe<PublicUser>> => {
    const res = await getUserWithId(ctx.store.kit, ctx.params.id)

    if (res.data === null) {
      return res
    }

    return Some({
      id: res.data.id,
      username: res.data.username,
      isAdmin: res.data.isAdmin === 1
    })

  }, {
    params: t.Object({
      id: t.String()
    })
  })
  .get("/users", async (ctx): Promise<Maybe<PublicUser[]>> => {
    const res = await getAllUsers(ctx.store.kit)
    if (res.data === null) {
      return None(res.error)
    }

    const userIds = res.data.map(user => ({
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin === 1
    }))

    return Some(userIds)
  })
