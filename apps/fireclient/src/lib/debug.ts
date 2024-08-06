import { getStoredSessions } from "@/lib/auth"
import { channelStore, messagesStore, usersStore, connectionStore, currentUserStore } from "@/lib/store"

export function printDebug() {
  const { data: sessions } = getStoredSessions()

  if (sessions) {
    console.log("===============================================")
    console.log(`APPLICATION STATE AS OF ${new Date().toISOString()}`)
    console.log("===============================================")
    console.log("Stored Sessions:")
    console.table(sessions.map((session) => ({
      address: session.address,
      username: session.username,
      token: session.token,
      valid: session.valid,
      found: session.found,
    })))

  } else {
    console.log("getStoredSessions returned null")
  }

  const connection = connectionStore.state
  console.log("Connection State:")
  console.log(connection.data)

  const users = usersStore.state
  console.log("Users State:")
  console.table(users)

  const channels = channelStore.state
  console.log("Channels State:")
  console.table(channels)

  const user = currentUserStore.state
  console.log("Current User State:")
  console.table(user)

  const messages = messagesStore.state
  for (const channel of messages) {
    console.log(`Messages for channel ${channel[0]}:`)
    console.table(messages.get(channel[0]))
  }

}
