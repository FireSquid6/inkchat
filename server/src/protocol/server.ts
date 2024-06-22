import { makeMessage, parseMessage, type NewMessagePayload } from ".";

export class MessageKind<T> {
  constructor(public name: string) {}
  make(payload: T): string {
    return makeMessage(this.name, payload)
  }
  parse(msg: string): T {
    const message = parseMessage(msg)
    return message.payload as T
  }
}

export const serverMessages = {
  newChat: new MessageKind<NewMessagePayload>("NEW_MESSAGE"),
  // userJoined: new MessageKind<UserJoinedPayload>("USER_JOINED"),
  // userLeft: new MessageKind<UserLeftPayload>("USER_LEFT"),
  unknown: new MessageKind<unknown>("UNKOWN")
}

export const clientMessages = {
  connect: new MessageKind<{ token: string }>("CONNECT"),
  // disconnect: new MessageKind<null>("DISCONNECT"),
  // chat: new MessageKind<ChatPayload>("CHAT"),
}
