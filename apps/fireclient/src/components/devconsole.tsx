import { getStoredSessions } from "@/lib/auth"
import { channelStore, messagesStore, usersStore, connectionStore } from "@/lib/store"

export function DevConsole() {
  // we don't want this to show up in production
  if (process.env.NODE_ENV === "production") {
    return <></>
  }

  const printInfo = () => {
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

    const messages = messagesStore.state
    for (const channel of messages) {
      console.log(`Messages for channel ${channel[0]}:`)
      console.table(messages.get(channel[0]))
    }
  }

  return (
    <button className="fixed bottom-0 right-0 m-2 text-sm btn btn-secondary" onClick={printInfo}>Application State</button>
  )
}
