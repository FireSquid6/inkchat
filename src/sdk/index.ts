import { treaty } from "@elysiajs/eden"
import type { App } from "@/index"
import type { Message, ChatPayload, ConnectPayload } from "@/protocol"
import { parseMessage, makeMessage } from "@/protocol"


type Listener = (client: InkchatClient, message: Message) => void


// acts as a wrapper around the treaty client
// connects to the api when instantiated
export class InkchatClient {
  private api: ReturnType<typeof treaty<App>>
  socket: WebSocket
  authToken: string = ""  // either an empty string or a valid auth token
  listeners: Listener[] = []

  constructor(url: string) {
    this.api = getTreaty(url)
    this.socket = new WebSocket(`${url}/socket`)

    this.socket.onmessage = (e) => {
      for (const listener of this.listeners) {
        const msg = parseMessage(e.data.toString())
        listener(this, msg)
      }
    }
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener)
  }
  unsubscribe(listener: Listener) {
    this.listeners = this.listeners.filter(l => l !== listener)
  }


  async signin(username: string, password: string) {
    const res = await this.api.auth.signin.post({ username, password })
    if (res.status === 200) {
      this.authToken = res.data?.token || ""
    } else {
      return Promise.reject(`Failed to sign in: ${res.data?.message}`)
    }

    return Promise.resolve()
  }
  async signup(username: string, password: string) {
    const res = await this.api.auth.signup.post({ username, password })
    if (res.status === 200) {
      this.authToken = res.data?.token || ""
    } else {
      return Promise.reject(`Failed to sign up: ${res.data?.message}`)
    }


    return Promise.resolve()
  }
  async signout() {
    await this.api.auth.signout.post("/auth/signout", {
      headers: {
        Authorization: `Bearer ${this.authToken}`
      }
    })
  }
  isLoggedin(): boolean {
    return this.authToken !== ""
  }


  connect() {
    this.socket.send(makeMessage<ConnectPayload>("CONNECT", {
      token: this.authToken
    }))
  }

  sendChatMessage(channelId: string, content: string) {
    this.socket.send(makeMessage<ChatPayload>("CHAT", {
      channelId,
      content,
    }))
  }

  async getUser(id: string) {
    return await this.api.users({ id }).get()
  }

  async getAllUsers() {
    return await this.api.users.get()
  }

  async getAllChannels() {
    return await this.api.channels.get()
  }

  async getChannel(id: string) {
    return await this.api.channels({ id }).get()
  }

  async getMessages(channelId: string, last: number = 200, before: number = Date.now()) {
    return await this.api.channels({ id: channelId }).messages.get({
      query: {
        last: last.toString(),
        before: before.toString(),
      }
    })
  }
}

function getTreaty(url: string): ReturnType<typeof treaty<App>> {
  const api = treaty<App>(url)
  return api
}
