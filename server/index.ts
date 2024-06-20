import { getDb } from "./db";
import { getAuth } from "./auth";
import { app } from "./api";
import { Config, type AppConfig } from "@/config";


// this kit is in the context for every api request
// it contains the database, auth, logger, etc.
export interface Kit {
  db: ReturnType<typeof getDb>
  auth: ReturnType<typeof getAuth>
  config: Config 
}

export function startApp(appConfig: AppConfig, db: ReturnType<typeof getDb>): Kit {
  const config = new Config(appConfig)
  const auth = getAuth(db)

  const kit: Kit = {
    db,
    auth,
    config,
  }

  app.store.kit = kit


  app.listen(config.port(), () => {
    console.log(`🚀 Server launched at ${config.port()}`)
  })
  return kit
}



export type App = typeof app;
