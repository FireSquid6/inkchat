import type { ChannelRow, PublicUser, MessageRow } from "api"
import { sdk } from "api"
import type { Maybe } from "maybe"
import { Store } from "@tanstack/store"
import { None, Some, unwrapOrThrow, unwrapOrDefault } from "maybe"
import { getStoredSessions, Session } from "./auth"


export const channelStore = new Store<ChannelRow[]>([])
export const messagesStore = new Store<Map<string, MessageRow[]>>(new Map())
export const usersStore = new Store<PublicUser[]>([])
export const connectionStore = new Store<Maybe<sdk.Connection>>(None("Not initialized"))
export const sessionsStore = new Store<Session[]>(
  unwrapOrDefault(getStoredSessions(), [])
)

export function resetStores() {
  channelStore.setState(() => [])
  messagesStore.setState(() => new Map())
  usersStore.setState(() => [])
  connectionStore.setState(() => None("Not initialized"))
}


export function connectTo(address: string, token: string) {
  resetStores()
  const connection = new sdk.Connection(address, token)
  connectionStore.setState(() => Some(connection))

  connection.stateChanged.once(async (state) => {
    if (!state.successfull) {
      console.error("Connection failed:", state.error)
      // TODO: handle this better
    }


    await Promise.all([
      new Promise<void>(async (resolve) => {
        const channels = unwrapOrThrow(await connection.getAllChannels())
        channelStore.setState(() => channels)
        resolve()
      }),
      new Promise<void>(async (resolve) => {
        const users = unwrapOrThrow(await connection.getAllUsers())
        usersStore.setState(() => users)
        resolve()
      }),
    ])
  })
}
