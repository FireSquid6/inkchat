import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { getDb } from "./lib/db";
import { getAuth } from "./lib/auth";
import { makeLoggerManager } from "./lib/logger";


export interface AppConfig {
  port: number
  storeDir: string
}


const app = new Elysia()
  .use(cors())

  // these states are deliberately left empty. They are set by startApp
  .state("config", {
    port: 3000,
    storeDir: "./data"
  } as AppConfig)

  .state("db", {} as ReturnType<typeof getDb>)
  .state("auth", {} as ReturnType<typeof getAuth>)
  .state("logger", {} as ReturnType<typeof makeLoggerManager>)

  .get("/", () => {

    return "Hello world!";
  })



// helper function to save some annoying keystrokes
function destructureContext(ctx: (typeof app)) {
  return {
    db: ctx.store.db,
    auth: ctx.store.auth,
    logger: ctx.store.logger,
    config: ctx.store.config,
  }
}

export function startApp(config: AppConfig) {
  const db = getDb(config.storeDir)
  const auth = getAuth(db)
  const loggerManager = makeLoggerManager(config)

  app.store.config = config;
  app.store.db = db;
  app.store.auth = auth;
  app.store.logger = loggerManager;

  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`)
  })


  return { db, auth, app }
}


export type App = typeof app;
