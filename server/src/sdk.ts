import { treaty } from "@elysiajs/eden"
import type { App } from "@/index"
import type { PublicUser } from "./api/users"
import { makeMessage, parseMessage, expectNewMessagePayload, expectUserLeftPayload, expectUserJoinedPayload, type ChatPayload, type NewMessagePayload, type UserJoinedPayload } from "./protocol"


export class InkchatClient {
  token: string
  api: ReturnType<typeof treaty<App>>
  socket: WebSocket | null = null

  events = {
    chat: new Pubsub<NewMessagePayload>(),
    connected: new Pubsub<null>(),
    disconnected: new Pubsub<null>(),
    userJoined: new Pubsub<UserJoinedPayload>(),
    userLeft: new Pubsub<UserJoinedPayload>(),
    error: new Pubsub<string>(),
  }

  constructor(token: string, url: string) {
    this.token = token
    this.api = treaty<App>(url)
  }

  connect(url: string) {
    this.socket = new WebSocket(url)

    this.socket.onopen = () => {
      this.socket!.send(makeMessage("CONNECT", { token: this.token }))
    }

    this.socket.onerror = (e) => {
      this.events.error.trigger(`websocket errored with event: ${e}`)
    }

    this.socket.onclose = () => {
      this.events.disconnected.trigger(null)
    }

    this.socket.onmessage = (e) => {
      this.handleWSMessage(e.data)
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close()
    }
  }

  private handleWSMessage(msg: string) {
    const message = parseMessage(msg)

    switch (message.kind) {
      case "NEW_MESSAGE":
        this.events.chat.trigger(expectNewMessagePayload(message))
        break
      case "USER_JOINED":
        this.events.userJoined.trigger(expectUserJoinedPayload(message))
        break
      case "USER_LEFT":
        this.events.userLeft.trigger(expectUserLeftPayload(message))
        break
      default:
        this.events.error.trigger(`Unknown message: ${msg}`)
    }
  }

  async getUsers(): Promise<Maybe<string[]>> {
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

    this.socket.send(makeMessage<ChatPayload>("CHAT", { channelId, content }))
    return Some(null)
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


// the maybe type wraps a values that may or may not exist. It's used lots of times when a function could fail 
export type Maybe<T> = { some: T, error: null } | { some: null, error: string }


type SomeMaybeHandler<T, R> = (some: T) => R
type NoneMaybeHandler<R> = (error: string) => R


// handles a maybe of type T
export function handleMaybe<T, Return>(maybe: Maybe<T>, some: SomeMaybeHandler<T, Return>, none: NoneMaybeHandler<Return>) {
  if (maybe.some) {
    return some(maybe.some!)
  } else {
    return none(maybe.error!)
  }
}

function Some<T>(value: T): Maybe<T> {
  return {
    some: value,
    error: null,
  }
}

function None<T>(error: string): Maybe<T> {
  return {
    some: null,
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


