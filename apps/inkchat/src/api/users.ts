import { Elysia, t } from "elysia"
import { kitPlugin } from "@/api"
import { getAllUsers, getUserWithId } from "@/db/user"
import { isNone } from "maybe"

export interface PublicUser {
  id: string
  username: string
  isAdmin: boolean
  bio?: string
  displayName?: string
}

export interface Profile {
  displayName: string
  bio: string
}

// bio, display name, etc
export const usersApi = (app: Elysia) =>
  app
    .use(kitPlugin)
    .get(
      "/users/:id",
      async (ctx): Promise<PublicUser | null> => {
        const res = await getUserWithId(ctx.store.kit, ctx.params.id)

        if (isNone(res)) {
          ctx.set.status = 404
          return null
        }

        ctx.set.status = 200
        return {
          id: res.data.id,
          username: res.data.username,
          isAdmin: res.data.isAdmin === 1,
          bio: res.data.bio ?? undefined,
          displayName: res.data.displayName ?? undefined,
        }
      },
      {
        params: t.Object({
          id: t.String()
        })
      }
    )
    .get("/users", async (ctx): Promise<PublicUser[]> => {
      const res = await getAllUsers(ctx.store.kit)
      if (isNone(res)) {
        return []
      }

      const userIds = res.data.map((user) => ({
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin === 1,
        bio: user.bio ?? undefined,
        displayName: user.displayName ?? undefined,
      }))

      return userIds
    })
    .get("/whoami", async (ctx): Promise<PublicUser | null> => {
      if (ctx.user === null) {
        return null
      }

      const user = await getUserWithId(ctx.store.kit, ctx.user.id)
      if (isNone(user)) {
        ctx.set.status = 404
        return null
      }

      return {
        username: user.data.username,
        id: user.data.id,
        isAdmin: user.data.isAdmin === 1,
        bio: user.data.bio ?? undefined,
        displayName: user.data.displayName ?? undefined,
      }
    })
