import { urlFromAddress } from "./address"
import { treaty } from "@elysiajs/eden"
import type { App } from "@/index"
import { Some, None, type Maybe, isNone } from "@/maybe"

export async function signIn(address: string, username: string, password: string): Promise<Maybe<string>> {
  const url = urlFromAddress(address)
  const api = treaty<App>(url)

  const res = await api.auth.signin.post({
    username,
    password
  }) 

  if (res.status !== 200) {
    console.log(res)
    return None(`Failed to sign in. Your address, username, or password may be incorrect.`)
  }

  if (!res.data) {
    return None(`No data from server`)
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


export type Session = {
  address: string,
  token: string,
}
export function getStoredSessions(): Maybe<Session[]> {
  try {
    const sessionsString = localStorage.getItem('sessions')
    if (!sessionsString) {
      return Some([])
    }

    const sessions: Session[] = JSON.parse(sessionsString)
    return Some(sessions)
  } catch (e) {
    return None(e as string)
  }
}

export function storeSession(session: Session): Maybe<void> {
  try {
    const sessions = getStoredSessions()
    if (isNone(sessions)) {
      return None(sessions.error)
    }

    const newSessions = [...sessions.data, session]
    localStorage.setItem('sessions', JSON.stringify(newSessions))
    return Some(undefined)
  } catch (e) {
    return None(e as string)
  }
}

export function removeSession(session: Session): Maybe<void> {
  try {
    const sessions = getStoredSessions()
    if (isNone(sessions)) {
      return None(sessions.error)
    }

    const newSessions = sessions.data.filter(s => s.address !== session.address)
    localStorage.setItem('sessions', JSON.stringify(newSessions))
    return Some(undefined)
  } catch (e) {
    return None(e as string)
  }
}
