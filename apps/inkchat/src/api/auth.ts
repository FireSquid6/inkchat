import { Elysia, t } from "elysia"
import { kitPlugin } from "@/api"
import {
  createUser,
  isValidPassword,
  isValidUsername,
  verifyPassword,
  createSession,
  validateJoincode,
  deleteJoincode
} from "@/db/auth"
import { getUserWithUsername } from "@/db/user"
import { isNone } from "maybe"

export const unprotectedAuthApi = (app: Elysia) =>
  app
    .use(kitPlugin)
    .post(
      "/auth/signup",
      async (ctx) => {
        const { password, username, code } = ctx.body

        const joincodeResponse = await validateJoincode(ctx.store.kit, code)

        if (isNone(joincodeResponse) || joincodeResponse.data === false) {
          return ctx.error(400, { token: "", message: "Invalid joincode" })
        }

        const deleteResponse = await deleteJoincode(ctx.store.kit, code)
        if (isNone(deleteResponse)) {
          return ctx.error(500, { token: "", message: "Failed to delete joincode" })
        }

        if (!isValidUsername(username)) {
          return ctx.error(400, { token: "", message: "Invalid username" })
        }

        if (!isValidPassword(password)) {
          // TODO - give a better reason as to why
          // could be done on a the client side instead
          return ctx.error(400, { token: "", message: "Invalid password. Password must contain a capital letter, a lowecase letter, a number, and at least one special character." })
        }

        let token = ""
        try {
          token = await createUser(ctx.store.kit, username, password)
        } catch (e) {
          console.error(e as string)
        }

        if (token === "") {
          return ctx.error(500, { token: "", message: "Failed to create user" })
        }

        ctx.set.status = 201
        return {
          token,
          message: "User created"
        }
      },
      {
        body: t.Object({
          password: t.String(),
          username: t.String(),
          code: t.String()
        })
      }
    )
    // TODO: implement throttling
    .post(
      "/auth/signin",
      async (ctx) => {
        const { username, password } = ctx.body
        const userRes = await getUserWithUsername(ctx.store.kit, username)

        if (userRes.data === null) {
          return ctx.error(400, { token: "", message: "Invalid username" })
        }
        const user = userRes.data

        const passwordValid = await verifyPassword(password, user.password)
        if (!passwordValid) {
          return ctx.error(400, { token: "", message: "Invalid password" })
        }

        // TODO: session length should still be a configurable value
        const session = await createSession(
          ctx.store.kit,
          user.id,
          Date.now() + 1000 * 60 * 60 * 24 * 30
        )

        ctx.set.status = 201
        return {
          token: session.id,
          message: "Logged in"
        }
      },
      {
        body: t.Object({
          username: t.String(),
          password: t.String()
        })
      }
    )
    .post("/auth/validate", async (ctx) => {
      if (ctx.session) {
        ctx.set.status = 200
      } else {
        ctx.set.status = 401
      }
    })

export const protectedAuthApi = (app: Elysia) =>
  app.use(kitPlugin).post("/auth/signout", async (ctx) => {
    const { auth } = ctx.store.kit

    await auth.invalidateUserSessions(ctx.user!.id)

    ctx.set.status = 200
    return {
      message: "Logged out. All sessions invalidated."
    }
  })
