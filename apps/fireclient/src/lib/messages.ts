import { MessageRow, sdk } from "api";


export class MessagesCache {
  messages: Map<string, MessageRow[]> = new Map()  // these will always stay sorted
  listeners: Map<string, Listener[]> = new Map()

  constructor(connection: sdk.Connection) {

  }

  async fetchMessages(channel: string, before: number, amount: number) {
  }

  subscribeTo(channel: string, listener: Listener): () => void {
    const listeners = this.listeners.get(channel) || []
    listeners.push(listener)
    this.listeners.set(channel, listeners)

    const unsubscribe = () => {
      this.listeners.set(channel, listeners.filter(l => l !== listener))
    }

    return unsubscribe
  }

  private emit(channel: string) {
    const messages = this.messages.get(channel) || []
    const listeners = this.listeners.get(channel) || []

    for (const listener of listeners) {
      listener(messages)
    }
  }
}

export function sortMessages(messages: MessageRow[]) {
  return messages.sort((a, b) => a.createdAt - b.createdAt)
}

// TODO - what was I doing here?
export class TimeSortedMessages {
  private messages: MessageRow[] = []

  constructor(initial: MessageRow[]) {
    // newer message (which has a greater createdAt) should be at the end of the array)
    initial.sort((a, b) => a.createdAt - b.createdAt)
  }

  push(message: MessageRow) {
    const index = this.messages.findIndex(m => m.createdAt > message.createdAt)
    if (index === -1) {
      this.messages.push(message)
    } else {
      this.messages.splice(index, 0, message)
    }
  }

  // stitch adds an array of messages to the cache and then sorts the entire cache
  // this can be more efficient sometimes
  stitch(messages: MessageRow[]) {
    this.messages.push(...messages)
    this.messages.sort((a, b) => a.createdAt - b.createdAt)
  }

  get(before: number, amount: number) {
    // find the latest message that is before the given time
    let index = this.messages.findIndex(m => m.createdAt >= before)

    if (index === -1) {
      index = this.messages.length - 1
    }

    if (index < 0) {
      index = 0
    }

    let start = index - amount

    if (start < 0) {
      start = 0
    }

    return this.messages.slice(start, index)
  }
}

export type Listener = (messages: MessageRow[]) => void
