import type { ChannelRow, PublicUser, MessageRow, sdk } from "api"
import type { Maybe } from "maybe"
import { Store } from "@tanstack/store"
import { None } from "maybe"


export const channelStore = new Store<ChannelRow[]>([])
export const messagesStore = new Store<Map<string, MessageRow[]>>(new Map())
export const usersStore = new Store<PublicUser[]>([])
export const connectionStore = new Store<Maybe<sdk.Connection>>(None("Not initialized"))


export function resetStores() {
  channelStore.setState(() => [])
  messagesStore.setState(() => new Map())
  usersStore.setState(() => [])
  connectionStore.setState(() => None("Not initialized"))
}

