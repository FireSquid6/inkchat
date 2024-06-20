import type { App } from "../../server/index";
import { treaty } from "@elysiajs/eden";
import type { Message, ChatPayload, ConnectPayload, NewMessagePayload } from "../../server/protocol";
import { expectNewMessagePayload, makeMessage, parseMessage } from "../../server/protocol";

type OK = string
export const ok: OK = "OK"
 
type MessageListener = (msg: Message) => void
type ConnectListener = (connceted: boolean) => void

export class InkchatClient {
  authToken: string = ""
  api: ReturnType<typeof treaty<App>> | null = null
  socket: WebSocket | null = null
  messageListeners: MessageListener[] = []
  connectListeners: ConnectListener[] = []

  private messagesCache = new MessagesCache(this)

  isConnected(): boolean {
    return this.api !== null && this.socket !== null
  }

  onConnect(listener: ConnectListener) {
    this.connectListeners.push(listener)
  }
  offConnect(listener: ConnectListener) {
    this.connectListeners = this.connectListeners.filter(l => l !== listener)
  }

  onMessage(listener: MessageListener) {
    this.messageListeners.push(listener)
  }

  offMessage(listener: MessageListener) {
    this.messageListeners= this.messageListeners.filter(l => l !== listener)
  }

  async connect(url: string, wsUrl: string): Promise<Error | OK> {
    this.api = treaty<App>(url)

    const res = await this.api.index.get()


    if (res.error) {
      return new Error("could not connect to the server")
    }

    return new Promise((resolve) => {
      this.socket = new WebSocket(wsUrl)

      this.socket.onmessage = (event) => {
        for (const listener of this.messageListeners) {
          listener(parseMessage(event.data))
        }
      }
      this.socket.onopen = () => {
        resolve(ok)
      }
    })
  }

  async signIn(username: string, password: string): Promise<Error | OK> {
    if (this.socket === null || this.api === null) {
      return new Error("You first must connect before signinig in")
    }

    const res = await this.api?.auth.signin.post({
      username,
      password
    })

    if (res.error) {
      console.log(res.error)
      return new Error("Error signing in")
    }

    this.authToken = res.data.token
    this.socket.send(makeMessage<ConnectPayload>("CONNECT", {
      token: res.data.token
    }))
    for (const listener of this.connectListeners) {
      listener(true)
    }

    return ok
  }


  async disconnect() {
    this.socket?.close()
    this.socket = null

    await this.api?.auth.signout.post({}, {
      headers: {
        Authorization: this.authToken
      }
    })

    this.authToken = ""
    this.api = null

    for (const listener of this.connectListeners) {
      listener(false)
    }
  }

  async chat(content: string, channelId: string) {
    if (this.socket === null) {
      return new Error("You first must connect before chatting")
    }

    this.socket.send(makeMessage<ChatPayload>("CHAT", {
      content,
      channelId
    }))
  }

  async messagesInChannel(channelId: string) {
    return await this.messagesCache.get(channelId)
  }
}


class MessagesCache {
  channelsMap = new Map<string, number>()  // maps the channel ids to where they are located in the messages array
  messages: NewMessagePayload[][] = []
  client: InkchatClient

  constructor(client: InkchatClient) {
    this.client = client
    client.onMessage((msg) => {
      if (msg.kind === "NEW_MESSAGE") {
        const payload = expectNewMessagePayload(msg)

      }
    })
  }

  async get(channelId: string) {
    let index = this.channelsMap.get(channelId)
    if (index === undefined) {
      index = await this.miss(channelId)

      if (index === -1) {
        return []
      }
    }

    return this.messages[index]
  }


  private async miss(channelId: string) {
    const messages = await this.client.api?.channels({ id: channelId }).messages.get({
      headers: {
        Authorization: this.client.authToken
      },
      query: {
        last: "200",
        before: Date.now().toString()
      }
    })

    if (messages === undefined || messages.error) {
      return -1
    }

    this.channelsMap.set(channelId, this.messages.length)
    this.messages.push(messages.data)

    return this.messages.length - 1
  }
}


export const client = new InkchatClient()
