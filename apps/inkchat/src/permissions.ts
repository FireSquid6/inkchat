import type { Kit } from "@/index"
import { getUserWithId } from "./db/user"
import { isNone } from "maybe"


// TODO - make this a failable function
export async function canCreateChannel(kit: Kit, userId: string): Promise<boolean> {
  const maybe = await getUserWithId(kit, userId)

  if (isNone(maybe)) {
    return false
  }

  const user = maybe.data

  return user.isAdmin === 1
}
