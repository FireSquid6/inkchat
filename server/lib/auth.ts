import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia"
import { sessionTable, userTable } from "./schema";


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


export function isValidEmail(email: string) {
  return /.+@.+/.test(email)
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


interface CreateUserOptions {
  email: string
  password: string
  username: string
}
export function createUser(user: CreateUserOptions) {
  if (!isValidEmail(user.email)) {
    throw new Error("Invalid email")
  }

}
