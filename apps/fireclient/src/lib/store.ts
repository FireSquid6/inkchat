import type { ChannelRow, PublicUser, MessageRow } from "api"
import { useState } from "react"
import { sdk } from "api"
import type { Failable } from "maybe"
import { Store } from "@tanstack/store"
import { useStore } from "@tanstack/react-store"
import { Err, Ok, unwrap } from "maybe"
import { serverMessages } from "protocol"
import { useEffect } from "react"

export const channelStore = new Store<ChannelRow[]>([])
export const messagesStore = new Store<Map<string, MessageRow[]>>(new Map())
export const usersStore = new Store<PublicUser[]>([])
export const connectionStore = new Store<Failable<sdk.Connection>>(
  Err("Not initialized")
)
export const currentUserStore = new Store<PublicUser | null>(null)

export function resetStores() {
  channelStore.setState(() => [])
  messagesStore.setState(() => new Map())
  usersStore.setState(() => [])
  currentUserStore.setState(() => null)
  connectionStore.setState(() => Err("Not initialized"))
}

export function useMessagesStore(extraFunction?: () => void) {
  const [messages, setMessages] = useState(messagesStore.state)

  useEffect(() => {
    const unsubscribe = messagesStore.subscribe(() => {
      if (extraFunction) {
        extraFunction()
      }
      setMessages(new Map(messagesStore.state))
    })

    return () => {
      unsubscribe()
    }
  }, [setMessages])

  return messages
}

export function connectTo(address: string, token: string) {
  resetStores()
  const connection = new sdk.Connection(address, token)
  connectionStore.setState(() => Ok(connection))

  connection.stateChanged.once(async (state) => {
    if (!state.successful) {
      console.error("Connection failed:", state.error)
      // TODO: handle this better
    }

    await Promise.all([
      new Promise<void>(async (resolve) => {
        const channels = unwrap<ChannelRow[]>(await connection.getAllChannels())
        channelStore.setState(() => channels)
        resolve()
      }),
      new Promise<void>(async (resolve) => {
        const users = unwrap<PublicUser[]>(await connection.getAllUsers())
        usersStore.setState(() => users)
        resolve()
      }),
      new Promise<void>(async (resolve) => {
        const currentUser = unwrap<PublicUser>(await connection.whoAmI())
        currentUserStore.setState(() => currentUser)
        resolve()
      })
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

export async function useUser(id: string | null) {
  if (id === null) {
    return null
  }

  const users = useStore(usersStore)
  const user = users.find((user) => user.id === id)

  return user || null
}

export async function updateMessages(
  connection: sdk.Connection,
  channelId: string
) {
  // TODO - handle error here
  // maybe a global error store?
  const [ messages ] = await connection.getMessagesInChannel(
    channelId,
    200,
    Date.now()
  )

  messagesStore.setState((state) => {
    state.set(channelId, messages)
    return state
  })
}

export function useConnectionState() {
  const [connection] = useStore(connectionStore)
  const startingState = (connection)
    ? {
        successful: connection.connected,
        pending: connection.pending,
        error: connection.error
      }
    : {
        successful: false,
        pending: true,
        error: ""
      }
  const [connectionState, setConnectionState] = useState(startingState)

  if (connection !== null) {
    connection.stateChanged.subscribe((state) => {
      setConnectionState(state)
    })
  }

  return connectionState
}
