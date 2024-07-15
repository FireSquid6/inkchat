import { treaty } from "@elysiajs/eden";
import type { App } from ".";
import { Some, None, type AsyncMaybe } from "maybe"

export async function signIn(url: string, username: string, password: string): AsyncMaybe<string> {
  const api = getTreaty(url)

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
  const api = getTreaty(url)

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


export class Connection {
  private api: ReturnType<typeof getTreaty>
  private socket: WebSocket
  authorization: string
  url: string

  constructor(url: string, socketUrl: string, token: string) {
    this.api = getTreaty(url)
    this.authorization = `Bearer ${token}`
    this.url = url
    this.socket = new WebSocket(socketUrl)
  }

  logout() {
    this.api.auth.signout.post({}, {
      headers: {
        authorization: this.authorization,
      }
    })

  }
}


function getTreaty(url: string) {
  return treaty<App>(url)
}
