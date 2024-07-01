import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import type { Kit } from "@/index";
import type { User } from "lucia";
import { swagger } from "@elysiajs/swagger";
import { logger } from "@bogeychan/elysia-logger";
import { userTable } from "@/db/schema"
import { eq } from "drizzle-orm"

import { protectedAuthApi, unprotectedAuthApi } from "@/api/auth"
import { channelsApi } from "@/api/channels";
import { usersApi } from "@/api/users";
import { connectionApi } from "@/api/connection"
import { adminApi } from "@/api/admin"
import { filesApi } from "@/api/files"


export const kitPlugin = (app: Elysia) => app
  // this is deliberately left empty. It is set whenever startApp() is called
  .state("kit", {} as Kit)

  .derive(async (ctx): Promise<{
    authorization: string | null
    user: User | null
    session: string | null
  }> => {
    // we always read and try to check for the token
    const authorization = ctx.request.headers.get("Authorization")
    const { auth } = ctx.store.kit

    if (!authorization) {
      return {
        authorization: null,
        user: null,
        session: null,
      }
    }

    const session = auth.readBearerToken(authorization)
    if (!session) {
      return {
        authorization: authorization,
        user: null,
        session: null,
      }
    }

    const { user } = await auth.validateSession(session)
    if (!user) {
      return {
        authorization: authorization,
        user: null,
        session: null,
      }
    }

    return {
      authorization: authorization,
      user,
      session,
    }
  })

export const app = new Elysia()
  // up here is unprotected! No auth required
  .use(cors())
  .use(logger({
    level: "info"
  }))
  .use(swagger({
    documentation: {
      info: {
        title: "Inkchat API",
        description: "The Inkchat API",
        version: "0.1.0"
      }
    }
  }))
  .use(kitPlugin)
  .use(unprotectedAuthApi)
  .get("/", (ctx) => {
    ctx.set.redirect = "/client"
    return {
      info: ctx.store.kit.config.serverInformation(),
      version: 1,  // this is in case we make breaking changes to the api and clients have to distinguish between multiple versions
    }
  })
  .use(connectionApi)

  .guard({
    async beforeHandle(ctx) {
      if (!ctx.authorization) {
        ctx.set.status = 401
        return {
          message: "No token provided"
        }
      }

      if (!ctx.session) {
        ctx.set.status = 401
        return {
          message: "Invalid token"
        }
      }

      if (!ctx.user) {
        ctx.set.status = 401
        return {
          message: "Invalid token"
        }
      }
    }
  }, (app) => app
    // anything down here is protected
    .use(protectedAuthApi)
    .use(filesApi)
    .use(channelsApi)
    .use(usersApi)

    .guard({
      async beforeHandle(ctx) {
        const { db } = ctx.store.kit
        const users = await db.select().from(userTable).where(eq(userTable.id, ctx.user?.id ?? ""))

        if (users.length === 0) {
          ctx.set.status = 400
          return { message: "User not found" }
        }
        const user = users[0]

        if (user.isAdmin !== 1) {
          ctx.set.status = 401
          return {
            message: "User is not an admin"
          }
        }
      }
    }, (app) => app
      // and here is super protected. Only admins can user it
      .use(adminApi)
    )
  )
