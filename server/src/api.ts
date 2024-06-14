import { createUser } from "./auth";
import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { Kit } from ".";

export const app = new Elysia()
  .use(cors())

  // this is deliberately left empty. It is set whenever startApp() is called
  .state("kit", {} as Kit)

  .get("/", () => {
    return "Hello world!";
  })
  .post("/auth/signup", async (ctx) => {
    // TODO: users should only be able to sign up if they have a specific code to do so
    // TODO: santize inputs to prevent XSS or SQL injection
    const { password, username } = ctx.body

    const { code, message, cookie } = await createUser(ctx.store.kit, username, password)

    ctx.set.status = code
    if (cookie != "") {
      ctx.headers["Set-Cookie"] = cookie
    }
    return message
  }, {
    body: t.Object({
      password: t.String(),
      username: t.String(),
    })
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



