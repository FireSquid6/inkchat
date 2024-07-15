import { urlFromAddress } from "./address"
import { Some, None, type Maybe, isNone } from "maybe"

export async function signIn(address: string, username: string, password: string): Promise<Maybe<string>> {
  const url = urlFromAddress(address)
  return None("something went wrong")
}


export async function signUp(address: string, username: string, password: string, joincode: string): Promise<Maybe<string>> {
  return None("something went wrong")
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
