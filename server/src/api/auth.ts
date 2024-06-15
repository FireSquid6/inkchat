import { Elysia, t } from "elysia"
import { kitPlugin } from "@/api"
import { createUser } from "@/auth";
import { isValidPassword, isValidUsername } from "@/auth";

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
    const token = await createUser(ctx.store.kit, username, password)
    if (token === "") {
      ctx.set.status = 500
      return { message: "Error creating user", token: "" }
    }

    ctx.set.status = 200
    return {
      message: "User created successfully",
      token
    }
  }, {
    body: t.Object({
      password: t.String(),
      username: t.String(),
    })
  })


export const protectedAuthApi = (app: Elysia) => app
  .use(kitPlugin)
  .post("/auth/logout", async (ctx) => {
    const { auth } = ctx.store.kit

    await auth.invalidateUserSessions(ctx.user!.id)

    ctx.set.status = 200
    return {
      message: "Logged out. All sessions invalidated."
    }
  })
  .post("/auth/login", async (ctx) => {
    // TODO: implement throttling
    const { username, password } = ctx.body


  }, {
    body: t.Object({
      username: t.String(),
      password: t.String(),
    })
  })
