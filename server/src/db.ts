import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

export function getDb(storeDirectory: string) {
  const sqlite = new Database(storeDirectory + "/db.sqlite");
  const db = drizzle(sqlite);

  return db
}
