import { startApp } from "@/index"
import { configFromFile, type AppConfig } from "@/config"
import { getDb, migrateDb, seed } from "@/db"
import fs from "fs"

export function startEphemeralApp(doSeed: boolean = false) {
  deleteDirectoryIfExists("store/ephemeral")
  ensureDirectoryExists("store/ephemeral")

  const config: AppConfig = {
    storeDir: "store/ephemeral",
    port: 3001,
    doInitialization: false,
    commandsInConsole: false,
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
  const config = configFromFile("store/prod/config.yaml")

  config.storeDir = "store/prod"
  config.port = 3000

  const db = getDb("store/prod/db.sqlite")
  migrateDb(db)

  return startApp(config, db)
}

export async function startDevApp(reset: boolean = false) {
  ensureDirectoryExists("store/dev")

  const config: AppConfig = {
    storeDir: "store/dev",
    port: 3000,
    doInitialization: false
  }

  if (reset) {
    deleteDirectoryIfExists("store/dev")
  }

  ensureDirectoryExists("store/dev")

  const db = getDb("store/dev/db.sqlite")
  migrateDb(db)
  if (reset) {
    await seed(db)
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
