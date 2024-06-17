import type { InferSelectModel } from "drizzle-orm"
import { messageTable, userTable } from "@/schema"

export interface Message {
  kind: string
  senderId: string  // this is always -1 if it's sent from thue server
  payload: object
}

export function parseMessage(msg: string): Message {
  const parsedMessage: Message = JSON.parse(msg)
  // TODO - ensure that it satiesfies the interface
  return parsedMessage
}

export type MessageHandler = (msg: Message) => void
export function doForMessage<Kind>(msg: Message, map: Map<Kind, MessageHandler>) {
  if (!map.has("UNKOWN" as Kind)) {
    throw Error("Passed map has to have a handler for an unkown message")
  }

  let handler: MessageHandler = map.get("UNKOWN" as Kind)!

  if (map.has(msg.kind as Kind)) {
    handler = map.get(msg.kind as Kind)!
  }
  try {
    handler(msg)
  } catch (e) {
    console.error(e)
  }
}


export type ServerMessageKind = "NEW_MESSAGE" | "USER_JOINED" | "USER_LEFT" | "UNKOWN"  // types of messages that the server can send to the client
export type NewMessagePayload = InferSelectModel<typeof messageTable>
export type UserJoinedPayload = InferSelectModel<typeof userTable>
export type UserLeftPayload = {
  userId: string
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
}
export function expectChatPayload(msg: Message): ChatPayload {
  return msg.payload as ChatPayload
}
