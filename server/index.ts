import Elysia from "elysia";
import type { Logger } from "./lib/logger";
import { cors } from "@elysiajs/cors";


export interface AppConfig {
  port: number
}


const app = new Elysia()
  .use(cors())
  .decorate("logger", {
    log(message: string) {
      console.log(message)
    },
    error(message: string) {
      console.error(message)
    }
  } as Logger)
  .get("/", () => {
    return "Hello world!";
  })



export function startApp(config: AppConfig) {
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`)
  })
}


export type App = typeof app;
