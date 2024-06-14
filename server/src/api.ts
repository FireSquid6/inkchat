import { createUser } from "./auth";
import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { Kit } from ".";

export const app = new Elysia()
  .use(cors())

  // these states are deliberately left empty. They are set by startApp
  .state("kit", {} as Kit)

  .get("/", () => {
    return "Hello world!";
  })
  .post("/auth/signup", async (ctx) => {
    // TODO: users should only be able to sign up if they have a specific code to do so
    // TODO: santize inputs to prevent XSS or SQL injection
    const { password, username } = ctx.body
    const kit  = ctx.store.kit

    const { code, message, cookie } = await createUser(kit, username, password)

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


  }, {
    body: t.Object({
      email: t.String(),
      password: t.String(),
    })
  })



