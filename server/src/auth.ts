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
export async function createUser(auth: ReturnType<typeof getAuth>, db: ReturnType<typeof getDb>, username: string, password: string): Promise<{ code: number, message: string, cookie: string }> {
  if (!isValidUsername(username)) {
    return { code: 400, message: "Invalid username", cookie: "" }
  }

  if (!isValidPassword(password)) {
    return { code: 400, message: "Invalid password", cookie: "" }
  }

  const passwordHash = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
  });
  const userId = generateIdFromEntropySize(32)

  let cookie = ""
  try {
    await db.insert(userTable).values({
      id: userId,
      username,
      password: passwordHash,
    })
    // TODO: standardize how long sesions last
    const session = await createSession(auth, userId, Date.now() + 1000 * 60 * 60 * 24 * 30)
    const cookieObj = auth.createSessionCookie(session.id)
    cookie = cookieObj.serialize()

  } catch (e) {
    console.error(e)
    return { code: 500, message: "Failed to create user", cookie: "" }
  }

  return { code: 200, message: "User created", cookie: "" }
}


export async function createSession(auth: ReturnType<typeof getAuth>, userId: string, expiresAt: number) {
  return await auth.createSession(userId, expiresAt)
}


export async function signIn(auth: ReturnType<typeof getAuth>, username: string, password: string) {
}
