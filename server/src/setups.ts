import { startApp, type AppConfig } from "@/index"
import { getDb, migrateDb, seed } from "@/db"
import fs from "fs"



export function startEphemeralApp(doSeed: boolean = false) {
  deleteDirectoryIfExists("store/ephemeral")
  ensureDirectoryExists("store/ephemeral")

  const config: AppConfig = {
    storeDir: "store/ephemeral",
    port: 3000,
  }

  const db = getDb(":memory:")
  migrateDb(db)

  if (doSeed) {
    seed(db)
  }

  return startApp(config, db)
}

export function startProductionApp() {
  ensureDirectoryExists("store/prod")

  const config: AppConfig = {
    storeDir: "store/prod",
    port: 80,
  }


  const db = getDb("store/prod/db")
  migrateDb(db)

  return startApp(config, db)
}


export function startDevApp(reset: boolean = false) {
  ensureDirectoryExists("store/dev")

  const config: AppConfig = {
    storeDir: "store/dev",
    port: 3000,
  }

  const db = getDb("store/dev/db")
  migrateDb(db)


  if (reset) {
    deleteDirectoryIfExists("store/dev")
    ensureDirectoryExists("store/dev")
    seed(db)
  }

  return startApp(config, db) 
}

function deleteDirectoryIfExists(directory: string) {
  if (fs.existsSync(directory)) {
    fs.rmdirSync(directory, { recursive: true })
  }
}


function ensureDirectoryExists(directory: string) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true })
  }
}
