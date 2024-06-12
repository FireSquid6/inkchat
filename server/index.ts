import Elysia from "elysia";
import { cors } from "@elysiajs/cors";


const app = new Elysia()
  .use(cors())
  .get("/", () => {
    return "Hello world!";
  })



export function startApp(loglevel: string = "info") {
  app.listen(3000, () => {
    console.log("Server is running on port 3000")
  })
}


export type App = typeof app;
