import { urlFromAddress } from "./address"
import { treaty } from "@elysiajs/eden"
import { None, Some, type App, type Maybe } from "@/index"

export async function signIn(address: string, username: string, password: string): Promise<Maybe<string>> {
  const url = urlFromAddress(address)
  const api = treaty<App>(url)

  const res = await api.auth.signin.post({
    username,
    password
  }) 

  if (!res.data) {
    return None(`No data from server`)
  }

  if (res.status !== 200) {
    return None(`Failed to sign in: ${res.status} ${res.data.message}`)
  }

  return Some(res.data.token)
}


export async function signUp(address: string, username: string, password: string, joincode: string): Promise<Maybe<string>> {
  const url = urlFromAddress(address)
  const api = treaty<App>(url)

  const res = await api.auth.signup.post({
    code: joincode,
    username,
    password
  }) 

  if (!res.data) {
    return None(`No data from server`)
  }

  if (res.status !== 200) {
    return None(`Failed to sign up: ${res.status} ${res.data.message}`)
  }

  return Some(res.data.token)
}
