import { userTable, type UserRow } from "@/db/schema"
import { eq } from "drizzle-orm"
import type { AsyncMaybe, Maybe } from "maybe"
import type { Kit } from "@/index"
import { Some, None } from "maybe"
import { Profile } from "@/api/users"

export async function getUserWithUsername(
  kit: Kit,
  username: string
): Promise<Maybe<UserRow>> {
  try {
    const users = await kit.db
      .select()
      .from(userTable)
      .where(eq(userTable.username, username))
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

export async function getUserWithId(
  kit: Kit,
  id: string
): Promise<Maybe<UserRow>> {
  try {
    const users = await kit.db
      .select()
      .from(userTable)
      .where(eq(userTable.id, id))
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

export async function promoteUser(
  kit: Kit,
  userId: string
): Promise<Maybe<void>> {
  try {
    await kit.db
      .update(userTable)
      .set({ isAdmin: 1 })
      .where(eq(userTable.id, userId))
    return Some(undefined)
  } catch (e) {
    return None(`database error while promoting user: ${e}`)
  }
}


export async function updateProfile(
  kit: Kit,
  userId: string,
  profile: Profile,
): AsyncMaybe<void> {
  const { db } = kit
  const { displayName, bio } = profile

  try {
    await db.update(userTable).set({ displayName, bio }).where(eq(userTable.id, userId))
  } catch (e) {
    return None(e as string)
  }

  return Some(undefined)
}


export function validateProfile(profile: Profile): Maybe<void> {
  const { displayName, bio } = profile

  if (displayName.length > 50) {
    return None("Display name too long")
  }

  if (bio.length > 160) {
    return None("Bio too long")
  }

  return Some(undefined)
}
