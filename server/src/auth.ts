import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia, generateIdFromEntropySize } from "lucia"
import { sessionTable, userTable } from "./schema";
import { hash } from "@node-rs/argon2";
import { getDb } from "./db";


export function getAuth(db: BunSQLiteDatabase) {
  const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable)
  return new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        secure: true,
      },
    },
    getUserAttributes: (attributes) => {
      return {
        email: attributes.email,
      }
    }
  })
}


declare module "lucia" {
  interface Register {
    Lucia: typeof Lucia
    DatabaseUserAttributes: {
      email: string
    }
  }
}


export function isValidUsername(username: string) {
  return /^[a-zA-Z0-9_]+$/.test(username)
}

export function isValidPassword(password: string) {
  if (password.length < 8) {
    return false
  }

  // contain one uppercase
  // one lowercase
  // one number
  // one special character
  if (!/[A-Z]/.test(password)) {
    return false
  }
  if (!/[a-z]/.test(password)) {
    return false
  }
  if (!/[0-9]/.test(password)) {
    return false
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return false
  }
  const specialCharacters = "!@#$%^&*()-+"
  if (!specialCharacters.split("").some((char) => password.includes(char))) {
    return false
  }

  return true
}


// todo: define a "kit" interface with the db, auth, logger, etc
export async function createUser(auth: ReturnType<typeof getAuth>, db: ReturnType<typeof getDb>, username: string, password: string): Promise<{ code: number, message: string }> {
  if (!isValidUsername(username)) {
    return { code: 400, message: "Invalid username" }
  }

  if (!isValidPassword(password)) {
    return { code: 400, message: "Invalid password" }
  }

  const passwordHash = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
  });
  const userId = generateIdFromEntropySize(32)

  try {
    await db.insert(userTable).values({
      id: userId,
      username,
      passwordHash,
    })
  } catch (e) {
    console.error(e)
    return { code: 500, message: "Failed to create user" }
  }

  return { code: 200, message: "User created" }
}
