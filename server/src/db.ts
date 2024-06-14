import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator"
import { faker } from "@faker-js/faker"
import { userTable } from "@/schema";

export function getDb(filepath: string) {
  const sqlite = new Database(filepath);
  const db = drizzle(sqlite);

  return db
}


export function migrateDb(db: ReturnType<typeof getDb>) {
  migrate(db, { migrationsFolder: "drizzle" })
}


interface SeedOptions {
  users: number
}

export async function seed(db: ReturnType<typeof getDb>, options: SeedOptions = {
  users: 10
}) {
  for (let i = 0; i < options.users; i++) {
    db.insert(userTable).values({
      id: faker.string.uuid(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
    })
  }
}
