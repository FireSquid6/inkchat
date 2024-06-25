import { treaty } from "@elysiajs/eden"
import type { App } from "@/index"
import type { PublicUser } from "./api/users"
import { clientMessages, parseMessage, serverMessages } from "@/protocol"
import type { InferSelectModel } from "drizzle-orm"
import type { channelTable, messageTable } from "./db/schema"


export class InkchatClient {
  token: string
  api: ReturnType<typeof treaty<App>>
  socket: WebSocket | null = null

  events = {
    chat: new Pubsub<ReturnType<typeof serverMessages.newChat.payloadAs>>(),
    connected: new Pubsub<null>(),
    disconnected: new Pubsub<null>(),
    userJoined: new Pubsub<ReturnType<typeof serverMessages.userJoined.payloadAs>>(),
    userLeft: new Pubsub<ReturnType<typeof serverMessages.userLeft.payloadAs>>(),
    error: new Pubsub<ReturnType<typeof serverMessages.error.payloadAs>>(),
  }

  isConnected: boolean = false

  constructor(token: string, url: string) {
    this.token = token
    this.api = treaty<App>(url)
  }

  connect(url: string) {
    this.socket = new WebSocket(url)

    this.socket.onopen = () => {
      this.isConnected = true
      this.socket!.send(clientMessages.connect.make({ authorization: this.token }))
    }

    this.socket.onerror = (e) => {
      this.isConnected = false
      this.events.error.trigger(`websocket errored with event: ${e}`)
    }

    this.socket.onclose = () => {
      this.isConnected = false
      this.events.disconnected.trigger(null)
    }

    this.socket.onmessage = (e) => {
      this.handleWSMessage(e.data)
    }
  }

  disconnect() {
    this.isConnected = false
    if (this.socket) {
      this.socket.close()
    }
  }

  private handleWSMessage(msg: string) {
    const message = parseMessage(msg)

    switch (message.kind) {
      case serverMessages.newChat.name:
        this.events.chat.trigger(serverMessages.newChat.payloadAs(message))
        break
      case serverMessages.userJoined.name:
        this.events.userJoined.trigger(serverMessages.userJoined.payloadAs(message))
        break
      case serverMessages.userLeft.name:
        this.events.userLeft.trigger(serverMessages.userLeft.payloadAs(message))
        break
      case serverMessages.error.name:
        this.events.error.trigger(serverMessages.error.payloadAs(message))
        break
      default:
        this.events.error.trigger(`Unknown message: ${msg}`)
    }
  }

  async getUserIds(): Promise<Maybe<string[]>> {
    const usersResponse = await this.api.users.get()

    if (usersResponse.data !== null) {
      return Some(usersResponse.data)
    }
    return None(`Faield to get users: ${usersResponse.error}`)
  }

  async getUser(id: string): Promise<Maybe<PublicUser>> {
    const userResponse = await this.api.users({ id: id }).get()

    if (userResponse.data !== null) {
      return Some(userResponse.data)
    }
    return None(`Failed to get user: ${userResponse.error}`)
  }

  async sendMessage(channelId: string, content: string): Promise<Maybe<null>> {
    if (!this.socket) {
      return None("Socket not connected")
    }

    this.socket.send(clientMessages.chat.make({ channelId, content }))
    return Some(null)
  }

  async getMessages(channelId: string, before: number, last: number): Promise<Maybe<InferSelectModel<typeof messageTable>[]>> {
    const messagesResponse = await this.api.channels({ id: channelId }).messages.get({
      headers: {
        Authorization: this.token
      },
      query: {
        before: before.toString(),
        last: last.toString(),
      }
    })

    if (messagesResponse.data !== null) {
      return Some(messagesResponse.data)
    }

    return None(`Failed to get messages: ${messagesResponse.error}`)
  }

  async getChannels(): Promise<Maybe<InferSelectModel<typeof channelTable>[]>> {
    const channelsResponse = await this.api.channels.get({
      headers: {
        Authorization: this.token
      }
    })

    if (channelsResponse.data !== null) {
      return Some(channelsResponse.data)
    }

    console.log(channelsResponse)
    return None(`Failed to get channels: ${channelsResponse.error}`)
  }

  async getChannel(id: string): Promise<Maybe<InferSelectModel<typeof channelTable>>> {
    const channelResponse = await this.api.channels({ id: id }).get({
      headers: {
        Authorization: this.token
      }
    })

    if (channelResponse.data !== null) {
      return Some(channelResponse.data)
    }

    return None(`Failed to get channel: ${channelResponse.error}`)
  }
}

// logs into the server at the specified url and returns a Maybe of the token
export async function newSession(url: string, username: string, password: string): Promise<Maybe<string>> {
  const api: ReturnType<typeof treaty<App>> = treaty<App>(url)
  const res = await api.auth.signin.post({ username, password })

  if (res.data !== null) {
    return Some(res.data.token)
  }

  return None(`Failed to login: ${res.error}`)
}

// TODO: should create a new account on the server
export function newAccount(url: string, username: string, passsword: string, code: string): Promise<Maybe<string>> {
  return Promise.resolve(None<string>("not implemented"))
}


// the maybe type wraps a values that may or may not exist. It's used lots of times when a function could fail 
export type Maybe<T> = { data: T, error: null } | { data: null, error: string }


type SomeMaybeHandler<T, R> = (some: T) => R
type NoneMaybeHandler<R> = (error: string) => R


// handles a maybe of type T
export function handleMaybe<T, Return>(maybe: Maybe<T>, some: SomeMaybeHandler<T, Return>, none: NoneMaybeHandler<Return>) {
  if (maybe.data) {
    return some(maybe.data!)
  } else {
    return none(maybe.error!)
  }
}

function Some<T>(value: T): Maybe<T> {
  return {
    data: value,
    error: null,
  }
}

function None<T>(error: string): Maybe<T> {
  return {
    data: null,
    error: error,
  }
}


type PubsubListener<T> = (arg0: T) => void
class Pubsub<T> {
  subscribers: PubsubListener<T>[] = []

  subscribe(listener: PubsubListener<T>) {
    this.subscribers.push(listener)
  }

  unsubscribe(listener: PubsubListener<T>) {
    // not sure if this is right
    this.subscribers.filter((l) => {
      return l !== listener
    })
  }

  once(trigger: PubsubListener<T>) {
    const callback = (value: T) => {
      trigger(value)
      this.unsubscribe(callback)
    }
    this.subscribe(callback)
  }

  trigger(value: T) {
    for (const listener of this.subscribers) {
      listener(value)
    }
  }
}


