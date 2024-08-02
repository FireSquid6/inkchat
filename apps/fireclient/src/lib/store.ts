import type { ChannelRow, PublicUser, MessageRow } from "api"
import { useState } from "react"
import { sdk } from "api"
import type { Maybe } from "maybe"
import { Store } from "@tanstack/store"
import { useStore } from "@tanstack/react-store"
import { None, Some, isSome, unwrapOrThrow } from "maybe"
import { serverMessages } from "protocol"


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


export function connectTo(address: string, token: string) {
  resetStores()
  const connection = new sdk.Connection(address, token)
  connectionStore.setState(() => Some(connection))

  connection.stateChanged.once(async (state) => {
    if (!state.successful) {
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

  connection.newMessage.subscribe((message) => {
    switch (message.kind) {
      case serverMessages.newChat.name:
        const chat = serverMessages.newChat.payloadAs(message)
        messagesStore.setState((state) => {
          const messages = state.get(chat.channelId) ?? []
          messages.push(chat)
          state.set(chat.channelId, messages)
          return state
        })
        break
    }


  })
}

export async function updateMessages(connection: sdk.Connection, channelId: string) {
  const maybe = await connection.getMessagesInChannel(channelId, 200, Date.now())
  let messages: MessageRow[] = []
  if (isSome(maybe)) {
    messages = maybe.data
  }

  messagesStore.setState((state) => {
    state.set(channelId, messages)
    return state
  })

}

export function useConnectionState() {
  const maybe = useStore(connectionStore)
  const startingState = isSome(maybe) ? {
    successful: maybe.data.connected,
    pending: maybe.data.pending,
    error: maybe.data.error,
  } : {
    successful: false,
    pending: true,
    error: "",
  }
  const [connectionState, setConnectionState] = useState(startingState)

  if (isSome(maybe)) {
    const connection = maybe.data
    connection.stateChanged.subscribe((state) => {
      setConnectionState(state)
    })
  }

  return connectionState
}
