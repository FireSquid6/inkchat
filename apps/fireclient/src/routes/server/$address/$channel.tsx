import { printDebug } from '@/lib/debug'
import { messagesStore, connectionStore, updateMessages, usersStore } from '@/lib/store'
import { createFileRoute } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { MessageRow } from 'api'

export const Route = createFileRoute('/server/$address/$channel')({
  component: () => <ChannelComponent />
})


function ChannelComponent() {
  printDebug()
  const channelId = Route.useParams().channel
  const { data: connection } = useStore(connectionStore)

  
  if (connection !== null) {
    console.log("updating messages")
    updateMessages(connection, channelId)
  }

  const currentMessages = useStore(messagesStore)
  let messages = currentMessages.get(channelId)

  if (messages === undefined) {
    messages = []
  }

  return (
    <div className="flex flex-col overflow-y-auto m-4">
      {messages.map((message, i) => (
        <Message key={i} {...message} />
      ))}
    </div>
  )
}


function Message(message: MessageRow) {
  const users = useStore(usersStore)

  const user = users.find((u) => u.id === message.userId)
  const dateTime = new Date(message.createdAt).toLocaleString()
  // TODO - render the message content using some sort of markdown system
  // probably need a custom compiler for this to be honest.
  return (
    <div className="flex flex-col mt-6">
      <div className="flxe flex-row">
        <div>{user?.username ?? "Unknown User"}</div>
        -
        <div className="ml-auto">{dateTime}</div>
      </div>
      <p className="ml-2">{message.content}</p>
    </div>
  )
}



