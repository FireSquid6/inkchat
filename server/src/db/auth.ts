import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia, generateIdFromEntropySize } from "lucia"
import { sessionTable, userTable, joincodeTable } from "./schema";
import { hash, verify } from "@node-rs/argon2";
import { Some, None, type Kit, type Maybe } from "@/index";
import { eq } from "drizzle-orm";


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

export async function deleteJoincode(kit: Kit, code: string): Promise<Maybe<boolean>> {
  try {
    await kit.db.delete(joincodeTable).where(eq(joincodeTable.id, code))
    return Some(true)
  } catch (e) {
    return None(`database error while deleting joincode: ${e}`)
  }
}

export async function makeJoincode(kit: Kit) {
  try {
    const joincode = Math.random().toString(36).substring(2, 8)

    await kit.db.insert(joincodeTable).values({
      id: joincode,
      createdAt: Date.now()
    })

    return Some(joincode)
  } catch (e) {
    return None(`database error while creating joincode: ${e}`)
  }
}

export async function validateJoincode(kit: Kit, code: string): Promise<Maybe<boolean>> {
  try {
    const joincodes = await kit.db.select().from(joincodeTable).where(eq(joincodeTable.id, code))
    if (joincodes.length === 0) {
      return Some(false)
    }

    return Some(true)
  } catch (e) {
    return None(`database error while validating joincode: ${e}`)
  }
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

