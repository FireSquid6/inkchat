import { getDb } from "./db";
import { getAuth } from "./auth";
import { makeLoggerManager } from "./logger";
import { app } from "./api";


// TODO: config factory
export interface AppConfig {
  port: number
  storeDir: string
}

// this kit is in the context for every api request
// it contains the database, auth, logger, etc.
export interface Kit {
  logger: ReturnType<typeof makeLoggerManager>
  db: ReturnType<typeof getDb>
  auth: ReturnType<typeof getAuth>
  config: AppConfig
}

export function startApp(config: AppConfig, db: ReturnType<typeof getDb>) {
  const auth = getAuth(db)
  const loggerManager = makeLoggerManager(config)

  app.store.kit = {
    config,
    db,
    auth,
    logger: loggerManager,
  }


  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`)
  })


  return { db, auth, app }
}



export type App = typeof app;
