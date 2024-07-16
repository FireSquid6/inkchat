import { treaty } from "@elysiajs/eden";
import type { CustomTreatyResponse } from "@/sdk/types"
import type { App } from "@/index";
import { Some, None, type AsyncMaybe } from "maybe"
import type { ServerInformation } from "@/config";
import { PublicUser } from "@/api/users";
import { ChannelRow, MessageRow } from "@/db/schema";
import { Message, parseMessage } from "protocol";

export async function signIn(url: string, username: string, password: string): AsyncMaybe<string> {
  const api = getTreaty(url, "")

  const res = await api.auth.signin.post({
    username,
    password
  })

  if (!res.data) {
    return None(`No data from server. Code ${res.status}`)
  }

  if (res.status !== 201) {
    return None(res.data.message)
  }

  return Some(res.data.token)
}


export async function signUp(url: string, username: string, password: string, joincode: string) {
  const api = getTreaty(url, "")

  const res = await api.auth.signup.post({
    code: joincode,
    username,
    password
  })

  if (!res.data) {
    return None("No data from server")
  }

  if (res.status !== 201) {
    return None(`Failed to sign up: ${res.status} ${res.data.message}`)
  }

  return Some(res.data.token)
}


// TODO: write tests using this
export class Connection {
  private api: ReturnType<typeof getTreaty>
  private socket: WebSocket
  private connected: boolean = false
  private pending: boolean = true
  private error: string = ""
  url: string
  authorization: string
  stateChanged = new Pubsub<{ successfull: boolean, pending: boolean, error: string }>()
  newMessage = new Pubsub<Message>

  constructor(url: string, socketUrl: string, token: string) {
    this.api = getTreaty(url, token)
    this.authorization = `Bearer ${token}`
    this.url = url
    this.socket = new WebSocket(socketUrl)
    this.setupSocket()
  }

  private setupSocket() {
    this.socket.onopen = () => {
      this.connected = true
      this.pending = false
      this.publishState()
    }

    this.socket.onerror = () => {
      this.connected = false
      this.pending = false
      this.error = "Something went wrong. Websocket error"
      this.publishState()
    }

    this.socket.onclose = () => {
      this.connected = false
      this.pending = false
      this.error = "Connection closed"
      this.publishState()
    }

    this.socket.onmessage = (event) => {
      const msg = event.data as string
      const parsed = parseMessage(msg)
      this.newMessage.publish(parsed)
    }
  }

  private publishState() {
    this.stateChanged.publish({ successfull: this.connected, pending: this.pending, error: this.error })
  }

  logout() {
    this.api.auth.signout.post({}, {
      headers: {
        authorization: this.authorization,
      }
    })
  }

  async info(): AsyncMaybe<ServerInformation> {
    return wrapTreatyResponse<ServerInformation>(await this.api.index.get())
  }

  async getUser(id: string): AsyncMaybe<PublicUser> {
    return wrapTreatyResponse<PublicUser>(await this.api.users({ id }).get())
  }

  async getAllUsers(): AsyncMaybe<PublicUser[]> {
    return wrapTreatyResponse<PublicUser[]>(await this.api.users.get())
  }

  async uploadAttachment(filename: string, file: File): AsyncMaybe<string> {
    return wrapTreatyResponse<string>(await this.api.attachments.post({
      filename,
      file,
    }))
  }

  async getAllChannels(): AsyncMaybe<ChannelRow[]> {
    return wrapTreatyResponse<ChannelRow[]>(await this.api.channels.get())
  }

  async getChannel(id: string): AsyncMaybe<ChannelRow> {
    return wrapTreatyResponse<ChannelRow>(await this.api.channels({ id }).get())
  }

  async getMessagesInChannel(id: string, last: number, before: number): AsyncMaybe<MessageRow[]> {
    return wrapTreatyResponse<MessageRow[]>(await this.api.channels({ id }).messages.get({
      query: {
        before: before.toString(),
        last: last.toString(),
      },
    }))
  }
}


function wrapTreatyResponse<T>(res: CustomTreatyResponse<Record<any, T | null>>): AsyncMaybe<T> {
  if (res.data === null) {
    return Promise.resolve(None(`No data from server. Code ${res.status}`))
  }

  if (!isOk(res.status)) {
    return Promise.resolve(None(`Status was not ok. Error was: ${res.error}. Data was: ${res.data}`))
  }

  return Promise.resolve(Some(res.data))

}

function isOk(code: number) {
  return code >= 200 && code < 300
}

function getTreaty(url: string, token: string) {
  return treaty<App>(url, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
}


type PubsubListener<T> = (data: T) => void
class Pubsub<T> {
  listeners: PubsubListener<T>[] = []

  subscribe(listener: PubsubListener<T>) {
    this.listeners.push(listener)
  }
  unsubscribe(listener: PubsubListener<T>) {
    this.listeners = this.listeners.filter(l => l !== listener)
  }
  publish(data: T) {
    this.listeners.forEach(l => l(data))
  }
  once(listener: PubsubListener<T>) {
    const wrapper = (data: T) => {
      listener(data)
      this.unsubscribe(wrapper)
    }
    this.subscribe(wrapper)
  }
}