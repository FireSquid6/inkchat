import { defineConfig } from "drizzle-kit";


export default defineConfig({
  schema: "./server/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "./store/dev/db.sqlite"
  }
})
