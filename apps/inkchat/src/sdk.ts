import type { App } from "@/index"
import { treaty } from "@elysiajs/eden"
import { Some, None, AsyncMaybe } from "maybe"
import { PublicUser } from "./api/users"


export class InkchatConnection {
  token: string
  url: string

  constructor(url: string, token: string) {
    this.token = token
    this.url = url
  }

  async connect() {

  }

  async getUsers(): AsyncMaybe<PublicUser[]> {
    const api = getTreaty(this.url)
    const res = await api.users.get()

    if (res.status === 200 && res.data !== null) {
      return Some(res.data)
    }

    return None(res.status.toString())
  }
}

function getTreaty(url: string) {
  return treaty<App>(url)
}
