import type { InferSelectModel } from "drizzle-orm"
import { messageTable } from "@/schema"

export interface Message {
  kind: string
  payload: object
}

const separator = "|"

export function makeMessage<PayloadType>(kind: string, payload: PayloadType): string {
  return kind + separator + JSON.stringify(payload)
}

export function parseMessage(msg: string): Message {
  const split = msg.split(separator)
  const payload = split.slice(1).join("")

  // there could be more parts if the separator is in the payload
  if (split.length < 2) {
    throw Error("Invalid message format")
  }


  const parsedMessage: Message = {
    kind: split[0],
    payload: JSON.parse(payload)
  }
  // TODO - ensure that it satiesfies the interface
  return parsedMessage
}

export type MessageHandler = (msg: Message) => void | Promise<void>
export async function doForMessage<Kind>(msg: Message, map: Map<Kind, MessageHandler>) {
  if (!map.has("UNKOWN" as Kind)) {
    throw Error("Passed map has to have a handler for an unkown message")
  }

  let handler: MessageHandler = map.get("UNKOWN" as Kind)!

  if (map.has(msg.kind as Kind)) {
    handler = map.get(msg.kind as Kind)!
  }
  try {
    await handler(msg)
  } catch (e) {
    console.error(e)
  }
}


export type ServerMessageKind = "NEW_MESSAGE" | "USER_JOINED" | "USER_LEFT" | "UNKOWN"  // types of messages that the server can send to the client
export type NewMessagePayload = InferSelectModel<typeof messageTable>
export function expectNewMessagePayload(msg: Message): NewMessagePayload {
  return msg.payload as NewMessagePayload
}
export type UserJoinedPayload = {
  id: string
}
export function expectUserJoinedPayload(msg: Message): UserJoinedPayload {
  return msg.payload as UserJoinedPayload
}
export type UserLeftPayload = {
  userId: string
}
export function expectUserLeftPayload(msg: Message): UserLeftPayload {
  return msg.payload as UserLeftPayload
}


export type ClientMessageKind = "CONNECT" | "CHAT" | "UNKOWN"  // types of messages that the client can send to the server
export type ConnectPayload = {
  token: string
}
export function expectConnectPayload(msg: Message): ConnectPayload {
  return msg.payload as ConnectPayload
}

export type ChatPayload = {
  content: string
  channelId: string
}
export function expectChatPayload(msg: Message): ChatPayload {
  return msg.payload as ChatPayload
}
