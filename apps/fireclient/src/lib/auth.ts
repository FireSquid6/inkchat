import { Some, None, type Maybe, isNone, unwrapOrDefault } from "maybe"
import { Store } from "@tanstack/store"
import { useStore } from "@tanstack/react-store"
import { sdk } from "api"

// sessions store is a bit different
// we need a store here to listen for changes, but it also needs to be persisted in localstorage
const sessionsStore = new Store<Session[]>(
  unwrapOrDefault(getStoredSessions(), [])
)

export type Session = {
  address: string,
  username: string,
  token: string,
  found: boolean,
  valid: boolean,
}

export function useSessions() {
  return useStore(sessionsStore)
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

export async function revalidateSessions() {
  const sessions = unwrapOrDefault(getStoredSessions(), [])
  const promises = sessions.map(revalidateSession)
  await Promise.all(promises)
}

async function revalidateSession(session: Session) {
  const code = await sdk.validateSession(session.address, session.token)

  if (code === 200) {
    return
  }

  removeSession(session)

  session.valid = false
  if (code === 404) {
    session.found = false
  }

  storeSession(session)
}

export function storeSession(session: Session): Maybe<void> {
  try {
    const sessions = getStoredSessions()
    if (isNone(sessions)) {
      return None(sessions.error)
    }

    const newSessions = [...sessions.data, session]
    localStorage.setItem('sessions', JSON.stringify(newSessions))

    sessionsStore.setState(() => newSessions)
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
    sessionsStore.setState(() => newSessions)
    return Some(undefined)
  } catch (e) {
    return None(e as string)
  }
}
