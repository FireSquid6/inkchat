import { userTable, type UserRow } from "@/db/schema"
import { eq } from "drizzle-orm"
import type { Kit, Maybe } from "@/index"
import { Some, None } from "@/index"

export async function getUserWithUsername(kit: Kit, username: string): Promise<Maybe<UserRow>> {
  try {
    const users = await kit.db.select().from(userTable).where(eq(userTable.username, username))
    if (users.length === 0) {
      return None("No user found with that username")
    }

    if (users.length > 1) {
      return None("Multiple users found with that username")
    }

    return Some(users[0])
  } catch (e) {
    return None(`database error while fetching user: ${e}`)
  }

}


export async function getUserWithId(kit: Kit, id: string): Promise<Maybe<UserRow>> {
  try {
    const users = await kit.db.select().from(userTable).where(eq(userTable.id, id))
    if (users.length === 0) {
      return None("No user found with that id")
    }

    if (users.length > 1) {
      return None("Multiple users found with that id")
    }

    return Some(users[0])

  } catch (e) {
    return None(`database error while fetching user: ${e}`)
  }
}


export async function getAllUsers(kit: Kit): Promise<Maybe<UserRow[]>> {
  try {
    const users = await kit.db.select().from(userTable)
    return Some(users)
  } catch (e) {
    return None(`database error while fetching users: ${e}`)
  }
}


export async function promoteUser(kit: Kit, userId: string): Promise<Maybe<void>> {
  try {
    await kit.db.update(userTable).set({ isAdmin: 1 }).where(eq(userTable.id, userId))
    return Some(undefined)
  } catch (e) {
    return None(`database error while promoting user: ${e}`)
  }
}
