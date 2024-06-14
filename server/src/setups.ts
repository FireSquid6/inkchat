import { startApp, type AppConfig } from "@/index"
import { getDb, migrateDb, seed } from "@/db"
import fs from "fs"



export function startEphemeralApp(doSeed: boolean = false) {
  deleteFolderIfExists("store/ephemeral")
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
  const config: AppConfig = {
    storeDir: "store/prod",
    port: 80,
  }


  const db = getDb("store/prod/db")
  migrateDb(db)

  return startApp(config, db)
}


export function startDevApp(reset: boolean = false) {
  const config: AppConfig = {
    storeDir: "store/dev",
    port: 3000,
  }

  const db = getDb("store/dev/db")
  migrateDb(db)


  if (reset) {
    deleteFolderIfExists("store/dev")
    seed(db)
  }

  return startApp(config, db) 
}

function deleteFolderIfExists(folder: string) {
  if (fs.existsSync(folder)) {
    fs.rmdirSync(folder, { recursive: true })
  }
}
