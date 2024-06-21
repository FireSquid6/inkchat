import { treaty } from "@elysiajs/eden"
import type { App } from "@/index"
import type { PublicUser } from "./api/users"


export class InkchatClient {
  token: string
  treaty: ReturnType<typeof treaty<App>>

  constructor(token: string, url: string) {
    this.token = token
    this.treaty = treaty<App>(url)
  }

  // stubbed out. Returns a set list
  async getUsers(): Promise<string[]> {
    return Promise.resolve([
      "1",
      "2",
      "3",
    ])
  }

  async getUser(id: string): Promise<Maybe<PublicUser>> {
    return Promise.resolve(Some({
      id: id,
      username: "test",
      isAdmin: false,
    }))
  }

  async sendMessage(channelId: string, content: string): Promise<void> {
    return Promise.resolve()
  }
}


// logs into the server at the specified url and returns a Maybe of the token
export function newSession(_url: string, _username: string, _password: string): Maybe<string> {
  // TODO - currently just stubbed
  return {
    some: "blahblahblah",
    error: null,
  }
}


// the maybe type wraps a values that may or may not exist. It's used lots of times when a function could fail 
export type Maybe<T> = { some: T, error: null } | { some: null, error: string}


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
}


