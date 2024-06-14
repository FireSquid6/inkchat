
import { getDb } from "./db";
import { getAuth } from "./auth";
import { makeLoggerManager } from "./logger";
import { app } from "./api";


export interface AppConfig {
  port: number
  storeDir: string
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
