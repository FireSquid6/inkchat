import type { Message, MessageHandler } from ".";

export type MessageKind =
  "CONNECT" | "CHAT" | "UNKOWN"


export function doForMessage<ReturnType>(msg: Message, map: Map<MessageKind, MessageHandler<ReturnType>>): ReturnType | Error {
  if (!map.has("UNKOWN")) {
    throw Error("Passed map has to have a handler for an unkown message")
  }

  // we know this won't be null because we just checked earlier
  let handler: MessageHandler<ReturnType> = map.get("UNKOWN")!
  if (map.has(msg.kind as MessageKind)) {
    // again, we also know that 
    handler = map.get(msg.kind as MessageKind)!
  } 

  // since we're only really loosely checking if the json fits the payload we expect stuff to not work
  // it is this package's burden to handle failures. All consumers should assume the happy path
  try {
    return handler(msg)
  } catch (e) {
    return e as Error
  }
}


// type "safety" stuff
export type ConnetPayload = {
  token: string
}
export function expectConnectPayload(msg: Message): ConnetPayload {
  return msg.payload as ConnetPayload
}

export type ChatPayload = {
  content: string
}
export function expectChatPayload(msg: Message): ChatPayload {
  return msg.payload as ChatPayload
}
