import { treaty } from "@elysiajs/eden";
import type { Treaty } from "@elysiajs/eden"
import type { CustomTreatyResponse } from "@/sdk/types"
import type { App } from "@/index";
import { Some, None, type AsyncMaybe, type Maybe } from "maybe"
import type { PublicUser } from "@/api/users";
import type { ServerInformation } from "@/config";

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
  url: string
  authorization: string

  constructor(url: string, socketUrl: string, token: string) {
    this.api = getTreaty(url, token)
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

  async info(): AsyncMaybe<ServerInformation> {
    const res = await this.api.index.get()
    const maybe = wrapTreatyResponse<ServerInformation>(res)

    return maybe
  }

  getUser(id: string) {

  }

  getAllUsers() {

  }
}


function wrapTreatyResponse<T>(res: CustomTreatyResponse<Record<any, T>> ): AsyncMaybe<T> {
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
