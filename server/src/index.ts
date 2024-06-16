import { getDb } from "./db";
import { getAuth } from "./auth";
import { app } from "./api";


// TODO: config factory
export interface AppConfig {
  port: number
  storeDir: string
}

// this kit is in the context for every api request
// it contains the database, auth, logger, etc.
export interface Kit {
  db: ReturnType<typeof getDb>
  auth: ReturnType<typeof getAuth>
  config: AppConfig
}

export function startApp(config: AppConfig, db: ReturnType<typeof getDb>): Kit {
  const auth = getAuth(db)

  const kit: Kit = {
    db,
    auth,
    config,
  }

  app.store.kit = kit


  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`)
  })


  return kit
}



export type App = typeof app;
