// contains frequently used functions for testing
import { getDb } from "./db";
import { getAuth } from "./auth";
import type { AppConfig, App } from "./index";
import { treaty } from "@elysiajs/eden";
import { startEphemeralApp } from "./setups";

export interface TestKit {
  db: ReturnType<typeof getDb>
  auth: ReturnType<typeof getAuth>
  config: AppConfig
  api: ReturnType<typeof treaty<App>>
}

export function testApp(): TestKit {
  const stdKit = startEphemeralApp()
  const api = treaty<App>("http://localhost:3001")

  return {
    db: stdKit.db,
    auth: stdKit.auth,
    config: stdKit.config,
    api,
  }
}
