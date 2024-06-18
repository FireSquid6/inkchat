import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia, generateIdFromEntropySize } from "lucia"
import { sessionTable, userTable } from "./schema";
import { hash, verify } from "@node-rs/argon2";
import type { Kit } from ".";


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

export async function verifyPassword(password: string, storedHash: string) {
  const validPassword = await verify(storedHash, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
  });

  return validPassword
}

export function signOut(kit: Kit, userId: string) {
  return kit.auth.invalidateUserSessions(userId)
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
export async function createUser(kit: Kit, username: string, password: string): Promise<string> {
  const { db } = kit

  const passwordHash = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
  });
  const userId = generateIdFromEntropySize(32)

  let token = ""
  await db.insert(userTable).values([{
    id: userId,
    password: passwordHash,
    username: username,
  }])

  // TODO: standardize how long sesions last
  const session = await createSession(kit, userId, Date.now() + 1000 * 60 * 60 * 24 * 30)
  token = session.id


  return token
}


export async function createSession({ auth }: Kit, userId: string, expiresAt: number) {
  return await auth.createSession(userId, expiresAt)
}


export async function signIn(auth: ReturnType<typeof getAuth>, username: string, password: string) {
}
