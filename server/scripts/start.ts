import { AppConfig, startApp } from "../src"

const config: AppConfig = {
  port: 3000,
  storeDir: "store",
}

startApp(config)
