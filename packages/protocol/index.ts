import type { InferSelectModel } from "drizzle-orm"
import { ChannelRow, Schema } from "api"

export interface Message {
  kind: string
  payload: any
}

export class MessageKind<T> {
  constructor(public name: string) {}
  make(payload: T): string {
    return makeMessage(this.name, payload)
  }
  parse(msg: string): T {
    const message = parseMessage(msg)
    return message.payload as T
  }
  payloadAs(msg: Message): T {
    if (msg.kind !== this.name) {
      throw Error(`Expected message kind ${this.name}, got ${msg.kind}`)
    }

    return msg.payload as T
  }
  is(msg: Message): boolean {
    return msg.kind === this.name
  }
}

export const serverMessages = {
  newChat: new MessageKind<NewMessagePayload>("NEW_MESSAGE"),
  userJoined: new MessageKind<UserEventPayload>("USER_JOINED"),
  userLeft: new MessageKind<UserEventPayload>("USER_LEFT"),

  channelDeleted: new MessageKind<{ id: string }>("CHANNEL_DELETED"),
  channelModified: new MessageKind<ChannelRow>("CHANNEL_MODIFIED"),
  channelCreated: new MessageKind<ChannelRow>("CHANNEL_CREATED"),

  error: new MessageKind<string>("ERROR")
}

export const clientMessages = {
  chat: new MessageKind<ChatPayload>("CHAT"),
  connect: new MessageKind<ConnectPayload>("CONNECT"),

  deleteChannel: new MessageKind<DeleteChannelPayload>("DELETE_CHANNEL"),
  modifyChannel: new MessageKind<ModifyChannelPayload>("MODIFY_CHANNEL"),
  createChannel: new MessageKind<CreateChannelPayload>("CREATE_CHANNEL")
}

export type DeleteChannelPayload = {
  id: string
}
export type ModifyChannelPayload = {
  id: string
  name: string
  description: string
}
export type CreateChannelPayload = {
  name: string
  description: string
}

export type NewMessagePayload = InferSelectModel<typeof Schema.messageTable>
export type UserEventPayload= {
  id: string
}
export type ConnectPayload = {
  authorization: string
}
export type ChatPayload = {
  content: string
  channelId: string
}
const separator = "|"

export function makeMessage<PayloadType>(
  kind: string,
  payload: PayloadType
): string {
  return kind + separator + JSON.stringify(payload)
}

export function parseMessage(msg: string): Message {
  const split = msg.split(separator)
  const payload = split.slice(1).join("")

  // there could be more parts if the separator is in the payload
  if (split.length < 2) {
    throw Error("Invalid message format: " + msg)
  }

  const parsedMessage: Message = {
    kind: split[0],
    payload: JSON.parse(payload)
  }

  return parsedMessage
}

export type MessageHandler = (msg: Message) => void | Promise<void>

export async function doForMessage(
  msg: Message,
  map: Map<string, MessageHandler>
): Promise<boolean> {
  let handler: MessageHandler
  if (map.has(msg.kind)) {
    handler = map.get(msg.kind)!
  } else {
    return false
  }

  try {
    await handler(msg)
  } catch (e) {
    console.error(e)
  }

  return true
}
