import { treaty } from "@elysiajs/eden"
import type { App } from "@/index"
import type { Message } from "@/protocol"
import { parseMessage } from "@/protocol"


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
    }
  }
  async signup(username: string, password: string) {
    const res = await this.api.auth.signup.post({ username, password })
    if (res.status === 200) {
      this.authToken = res.data?.token || ""
    }
  }
  signout() {

  }

  isLoggedin(): boolean {
    return this.authToken !== ""
  }
}

function getTreaty(url: string): ReturnType<typeof treaty<App>> {
  const api = treaty<App>(url)
  return api
}
