import { treaty } from "@elysiajs/eden"
import type { CustomTreatyResponse } from "@/sdk/types"
import type { App } from "@/index"
import { type AsyncFailable, Ok, Err } from "maybe"
import type { ServerInformation } from "@/config"
import { PublicUser } from "@/api/users"
import { ChannelRow, JoincodeRow, MessageRow } from "@/db/schema"
import { clientMessages, Message, parseMessage } from "protocol"

export async function signIn(
  address: string,
  username: string,
  password: string
): AsyncFailable<string> {
  const url = urlFromAddress(address)
  const api = getTreaty(url, "")

  const res = await api.auth.signin.post({
    username,
    password
  })


  if (!res.data) {
    return Err(`${res.status} - ${res.error.value.message ?? "Unkown error"}`)
  }

  if (res.status !== 201) {
    return Err(res.data.message)
  }

  return Ok(res.data.token)
}

export async function validateSession(
  address: string,
  token: string
): Promise<number> {
  const url = urlFromAddress(address)
  const api = getTreaty(url, token)

  const res = await api.auth.validate.post({})

  return res.status
}

export async function signUp(
  address: string,
  username: string,
  password: string,
  joincode: string
): AsyncFailable<string> {
  const url = urlFromAddress(address)
  const api = getTreaty(url, "")

  const res = await api.auth.signup.post({
    code: joincode,
    username,
    password
  })

  if (!res.data) {
    return Err(`${res.status} - ${res.error.value.message}`)
  }

  if (res.status !== 201) {
    return Err(`Failed to sign up: ${res.status} ${res.data.message}`)
  }

  return Ok(res.data.token)
}

export async function signOut(address: string, token: string) {
  const url = urlFromAddress(address)
  const api = getTreaty(url, token)

  await api.auth.signout.post({})
}

export class Connection {
  private api: ReturnType<typeof getTreaty>
  private socket: WebSocket

  connected: boolean = false
  pending: boolean = true
  error: string = ""

  url: string
  authorization: string
  stateChanged = new Pubsub<{
    successful: boolean
    pending: boolean
    error: string
  }>()
  newMessage = new Pubsub<Message>()
  address: string
  retryTimeout: number   // the amount of time in ms to wait before trying to reconnect

  constructor(address: string, token: string, retryTimeout: number = -1) {
    this.retryTimeout = retryTimeout
    this.url = urlFromAddress(address)
    this.api = getTreaty(this.url, token)
    this.address = address
    this.authorization = `Bearer ${token}`
    const socketUrl = socketFromAddress(address)
    this.socket = new WebSocket(socketUrl)
    this.setupSocket()
  }

  private setupSocket() {
    this.socket.onopen = () => {
      this.connected = true
      this.pending = false
      this.publishState()

      this.socket.send(
        clientMessages.connect.make({
          authorization: this.authorization
        })
      )
    }

    // TODO - does the the close event get called when the server errors? Or just the error event?
    // this.socket.onerror = () => {
    //   this.connected = false
    //   this.pending = false
    //   this.error = "Something went wrong. Unspecified websocket error"
    //   this.tryReconnect()
    //   this.publishState()
    // }

    this.socket.onclose = (e) => {
      this.connected = false
      this.pending = false
      this.error = "Websocket closed: " + e.reason
      this.tryReconnect()
      this.publishState()
    }

    this.socket.onmessage = (event) => {
      const msg = event.data as string
      const parsed = parseMessage(msg)
      this.newMessage.publish(parsed)
    }
  }

  private async tryReconnect() {
    this.socket.close()
    
    if (this.retryTimeout === -1) {
      return
    }

    await new Promise((resolve) => setTimeout(resolve, this.retryTimeout))
  }

  private publishState() {
    this.stateChanged.publish({
      successful: this.connected,
      pending: this.pending,
      error: this.error
    })
  }

  // disconnects the websocket
  disconnect() {
    this.retryTimeout = -1
    this.socket.close()
  }

  // invalidates the current token
  // you probably also want to call disconnect
  logout() {
    this.api.auth.signout.post(
      {},
      {
        headers: {
          Authorization: this.authorization
        }
      }
    )
  }

  async info(): AsyncFailable<ServerInformation> {
    return wrapTreatyResponse<ServerInformation>(await this.api.index.get())
  }

  async getUser(id: string): AsyncFailable<PublicUser> {
    return wrapTreatyResponse<PublicUser>(await this.api.users({ id }).get())
  }

  async getAllUsers(): AsyncFailable<PublicUser[]> {
    return wrapTreatyResponse<PublicUser[]>(await this.api.users.get())
  }

  async uploadAttachment(filename: string, file: File): AsyncFailable<string> {
    return wrapTreatyResponse<string>(
      await this.api.attachments.post({
        filename,
        file
      })
    )
  }

  async getAllChannels(): AsyncFailable<ChannelRow[]> {
    return wrapTreatyResponse<ChannelRow[]>(await this.api.channels.get())
  }

  async getChannel(id: string): AsyncFailable<ChannelRow> {
    return wrapTreatyResponse<ChannelRow>(await this.api.channels({ id }).get())
  }

  async getMessagesInChannel(
    id: string,
    last: number,
    before: number
  ): AsyncFailable<MessageRow[]> {
    return wrapTreatyResponse<MessageRow[]>(
      await this.api.channels({ id }).messages.get({
        query: {
          before: before.toString(),
          last: last.toString()
        }
      })
    )
  }

  async whoAmI(): AsyncFailable<PublicUser> {
    return wrapTreatyResponse<PublicUser>(await this.api.whoami.get())
  }

  sendMessage(channelId: string, content: string) {
    const message = clientMessages.chat.make({ channelId, content })
    this.socket.send(message)
  }

  createChannel(name: string, description: string) {
    const message = clientMessages.createChannel.make({ name, description })
    this.socket.send(message)
  }

  deleteChannel(id: string) {
    const message = clientMessages.deleteChannel.make({ id })
    this.socket.send(message)
  }

  async makeJoincode(): AsyncFailable<string> {
    const res = await this.api.admin.joincode.post({})

    if (!res.data) {
      return Err("No data from server")
    }

    return Ok(res.data.code)
  }

  async deleteJoincode(code: string): AsyncFailable<string> {
    const res = await this.api.admin.joincode.delete({
      code
    })

    if (res.status === 404) {
      return Err("Joincode not found")
    }

    return Ok("Joincode deleted")
  }

  async getJoincodes(): AsyncFailable<JoincodeRow[]> {
    const res = await this.api.admin.joincode.get()
    return wrapTreatyResponse<JoincodeRow[]>(res)
  }


  getAvatarUrl(userId: string): string {
    return `${this.url}/avatars/${userId}`
  }
}

function wrapTreatyResponse<T>(
  res: CustomTreatyResponse<Record<any, T | null>>
): AsyncFailable<T> {
  if (res.data === null) {
    return Promise.resolve(Err(`No data from server. Code ${res.status}`))
  }

  if (!isOk(res.status)) {
    return Promise.resolve(
      Err(`Status was not ok. Error was: ${res.error}. Data was: ${res.data}`)
    )
  }

  return Promise.resolve(Ok(res.data))
}

function isOk(code: number) {
  return code >= 200 && code < 300
}

function getTreaty(url: string, token: string) {
  return treaty<App>(url, {
    headers: {
      Authorization: `Bearer ${token}`
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
    this.listeners = this.listeners.filter((l) => l !== listener)
  }
  publish(data: T) {
    this.listeners.forEach((l) => l(data))
  }
  once(listener: PubsubListener<T>) {
    const wrapper = (data: T) => {
      listener(data)
      this.unsubscribe(wrapper)
    }
    this.subscribe(wrapper)
  }
}

function urlFromAddress(address: string): string {
  if (address.startsWith("localhost")) {
    return `http://${address}`
  }
  return `https://${address}`
}

function socketFromAddress(address: string): string {
  if (address.startsWith("localhost")) {
    return `ws://${address}/socket`
  }
  return `wss://${address}/socket`
}
