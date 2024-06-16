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


export type MessageHandler<ReturnType> = (msg: Message) => ReturnType
