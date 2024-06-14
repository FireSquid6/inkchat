import { getDb } from "./db";
import { createUser, getAuth, isValidPassword } from "./auth";
import { makeLoggerManager } from "./logger";
import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { AppConfig } from ".";

export const app = new Elysia()
  .use(cors())

  // these states are deliberately left empty. They are set by startApp
  .state("config", {} as AppConfig)
  .state("db", {} as ReturnType<typeof getDb>)
  .state("auth", {} as ReturnType<typeof getAuth>)
  .state("logger", {} as ReturnType<typeof makeLoggerManager>)

  .get("/", () => {
    return "Hello world!";
  })
  .post("/auth/signup", async (ctx) => {
    // TODO: users should only be able to sign up if they have a specific code to do so
    // TODO: santize inputs to prevent XSS or SQL injection
    const { password, username } = ctx.body
    const { auth, db } = ctx.store

    const { code, message } = await createUser(auth, db, username, password)

    ctx.set.status = code
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



