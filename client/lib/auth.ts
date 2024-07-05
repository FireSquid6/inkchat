import { urlFromAddress } from "./address"
import { treaty } from "@elysiajs/eden"
import { None, Some, isNone, type App, type Maybe } from "@/index"

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


export function storeSession(session: Session): Maybe<undefined> {
  const res = getStoredSessions()
  if (isNone(res)) {
    return None(res.error)
  }

  const sessions = res.data
  sessions.push(session)
  localStorage.setItem('sessions', JSON.stringify(sessions))
  return Some(undefined)
}

export function removeSession(session: Session): Maybe<undefined> {
  const res = getStoredSessions()
  if (isNone(res)) {
    return None(res.error)
  }

  const sessions = res.data
  const newSessions = sessions.filter(s => s.address !== session.address)
  localStorage.setItem('sessions', JSON.stringify(newSessions))
  return Some(undefined)
}
