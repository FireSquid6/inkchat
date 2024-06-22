import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import type { Kit } from "@/index";
import type { User } from "lucia";
import { swagger } from "@elysiajs/swagger";
import { logger } from "@bogeychan/elysia-logger";

import { protectedAuthApi, unprotectedAuthApi } from "@/api/auth"
import { channelsApi } from "@/api/channels";
import { usersApi } from "@/api/users";
import { filesApi } from "@/api/files";
import { connectionApi } from "@/api/connection"


export const kitPlugin = (app: Elysia) => app
  // this is deliberately left empty. It is set whenever startApp() is called
  .state("kit", {} as Kit)
  .use(logger({
    level: "info" 
  }))
  .derive(async (ctx): Promise<{
    token: string | null
    user: User | null
    session: string | null
  }> => {
    // we always read and try to check for the token
    const token = ctx.request.headers.get("Authorization")
    const { auth } = ctx.store.kit

    if (!token) {
      return {
        token: null,
        user: null,
        session: null,
      }
    }

    const session = auth.readBearerToken(token)
    if (!session) {
      return {
        token,
        user: null,
        session: null,
      }
    }

    const { user } = await auth.validateSession(session)
    if (!user) {
      return {
        token,
        user: null,
        session: null,
      }
    }

    return {
      token,
      user,
      session,
    }
  })

export const app = new Elysia()
  // up here is unprotected! No auth required
  .use(cors())
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
  .use(connectionApi)
  .get("/", (ctx) => {
    return {
      info: ctx.store.kit.config.serverInformation(),
      version: 1,  // this is in case we make breaking changes to the api and clients have to distinguish between multiple versions
    }
  })

  .guard({
    async beforeHandle(ctx) {
      if (!ctx.token) {
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
    .use(channelsApi)
    .use(usersApi)
    .use(filesApi)

  )
