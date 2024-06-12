import Elysia from "elysia";
import type { Logger } from "./lib/logger";
import { cors } from "@elysiajs/cors";


export interface AppConfig {
  port: number
  storeDir: string
}


const app = new Elysia()
  .use(cors())
  .state("config", {
    port: 3000,
    storeDir: "./data"
  } as AppConfig)
  .get("/", () => {

    return "Hello world!";
  })



export function startApp(config: AppConfig) {
  app.state("config", config)
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`)
  })
}


export type App = typeof app;
