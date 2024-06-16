import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import type { Kit } from "@/index";
import { protectedAuthApi, unprotectedAuthApi } from "@/api/auth"
import type { User } from "lucia";
import { Logestic } from "logestic";


export const kitPlugin = (app: Elysia) => app
  // this is deliberately left empty. It is set whenever startApp() is called
  .state("kit", {} as Kit)
  .use(Logestic.preset("fancy"))
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
  .use(kitPlugin)
  .use(unprotectedAuthApi)

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

  )
