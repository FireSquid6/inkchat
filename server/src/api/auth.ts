import { Elysia, t } from "elysia"
import { kitPlugin } from "@/api"
import { createUser, isValidPassword, isValidUsername, verifyPassword, createSession } from "@/db/auth";
import { getUserWithUsername } from "@/db";

export const unprotectedAuthApi = (app: Elysia) => app
  .use(kitPlugin)
  .post("/auth/signup", async (ctx) => {
    // TODO: users should only be able to sign up if they have a specific code to do so
    // TODO: santize inputs to prevent XSS or SQL injection
    const { password, username } = ctx.body
    if (!isValidUsername(username)) {
      ctx.set.status = 400
      return { message: "Invalid username", token: "" }
    }

    if (!isValidPassword(password)) {
      ctx.set.status = 400
      return { message: "Invalid password", token: "" }
    }

    let token = ""
    try {
      token = await createUser(ctx.store.kit, username, password)
    } catch (e) {
      console.error(e as string)
    }

    if (token === "") {
      ctx.set.status = 500
      return { token: "" }
    }

    ctx.set.status = 200
    return {
      token
    }
  }, {
    body: t.Object({
      password: t.String(),
      username: t.String(),
      code: t.String(),
    })
  })
  // TODO: implement throttling
  .post("/auth/signin", async (ctx) => {
    const { username, password } = ctx.body
    const user = await getUserWithUsername(ctx.store.kit, username)

    if (!user) {
      ctx.set.status = 400
      return {
        message: "Invalid username",
        token: ""
      }
    }

    const passwordValid = await verifyPassword(password, user.password)
    if (!passwordValid) {
      ctx.set.status = 400
      return {
        message: "Invalid password",
        token: ""
      }
    }

    // TODO: session length should still be a configurable value
    const session = await createSession(ctx.store.kit, user.id, Date.now() + 1000 * 60 * 60 * 24 * 30)

    ctx.set.status = 200
    return {
      message: "Logged in successfully",
      token: session.id
    }
  }, {
    body: t.Object({
      username: t.String(),
      password: t.String(),
    })
  })
  .post("/auth/validate", async (ctx) => {
    if (ctx.session) {
      ctx.set.status = 200
    } else {
      ctx.set.status = 401
    }
  }, {
    headers: t.Object({
      Authorization: t.String()
    })
  })

export const protectedAuthApi = (app: Elysia) => app
  .use(kitPlugin)
  .post("/auth/signout", async (ctx) => {
    const { auth } = ctx.store.kit

    await auth.invalidateUserSessions(ctx.user!.id)

    ctx.set.status = 200
    return {
      message: "Logged out. All sessions invalidated."
    }
  })

