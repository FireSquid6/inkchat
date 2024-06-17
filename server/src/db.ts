import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator"
import { faker } from "@faker-js/faker"
import { channelTable, userTable, messageTable } from "@/schema";
import type { Kit } from ".";
import { eq } from "drizzle-orm";

export function getDb(filepath: string) {
  const sqlite = new Database(filepath);
  const db = drizzle(sqlite);

  return db
}


export function migrateDb(db: ReturnType<typeof getDb>) {
  migrate(db, { migrationsFolder: "drizzle" })
  console.log("🗄️ Migrated Database")
}


interface SeedOptions {
  users: number
  channels: number
  messagesPerChannel: number
}

export async function seed(db: ReturnType<typeof getDb>, options: SeedOptions = {
  users: 10,
  channels: 4,
  messagesPerChannel: 25,
}) {
  const userIds = []
  for (let i = 0; i < options.users; i++) {
    const id = faker.string.uuid()
    db.insert(userTable).values({
      id: id,
      username: faker.internet.userName(),
      password: faker.internet.password(),
    })
    userIds.push(id)
  }
  
  for (let i = 0; i < options.channels; i++) {
    const id = faker.string.uuid()
    db.insert(channelTable).values({
      id,
      name: faker.hacker.noun(),
      description: faker.hacker.phrase(),
      createdAt: Date.now(),
    })

    for (let j = 0; j < options.messagesPerChannel; j++) {
      db.insert(messageTable).values({
        userId: faker.helpers.arrayElement(userIds),
        id: faker.string.uuid(),
        content: faker.lorem.paragraph(),
        createdAt: Date.now(),
        channelId: id,
      })
    }
  }

  console.log("🌱 Seeded Database")
}


export async function getUserWithUsername(kit: Kit, username: string) {
  const users = await kit.db.select().from(userTable).where(eq(userTable.username, username))
  if (users.length === 0) {
    return null
  }

  if (users.length > 1) {
    throw new Error("Multiple users with the same username. How'd you screw this up?")
  }

  return users[0]
}