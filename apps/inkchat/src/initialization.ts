import { unwrapOrDefault, unwrapOrThrow } from "maybe"
import type { Kit } from "."
import { getAllUsers } from "./db/user"
import { makeJoincode } from "./db/auth"
import { getAllChannels, makeChannel } from "./db/channels"
import { joincodeTable } from "./db/schema"

export async function createInitialJoincode(kit: Kit) {
  const users = unwrapOrDefault(await getAllUsers(kit), [])
  const joincodes = await kit.db.select().from(joincodeTable)

  if (users.length > 0) {
    return
  }

  if (joincodes.length > 0) {
    return
  }

  const joincode = unwrapOrThrow(await makeJoincode(kit, true))
  console.log(
    `No users or joincodes detected. Created initial joincode: ${joincode}`
  )
}

export async function createInitialChannel(kit: Kit) {
  const channels = unwrapOrDefault(await getAllChannels(kit), [])

  if (channels.length > 0) {
    return
  }

  const channel = unwrapOrThrow(
    await makeChannel(kit, "general", "General chat")
  )
  console.log(
    `No channels detected. Created initial channel "#${channel.name}"`
  )
}
