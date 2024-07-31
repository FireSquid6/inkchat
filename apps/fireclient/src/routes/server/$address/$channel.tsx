import { messagesStore, connectionStore, updateMessages } from '@/lib/store'
import { createFileRoute } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { MessageRow } from 'api'

export const Route = createFileRoute('/server/$address/$channel')({
  component: () => <ChannelComponent />
})


function ChannelComponent() {
  const channelId = Route.useParams().channel
  const { data: connection } = useStore(connectionStore)

  if (connection !== null) {
    updateMessages(connection, channelId)
  }

  const currentMessages = useStore(messagesStore)
  const messages = currentMessages.get(channelId)

  if (messages === undefined) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {messages.map((message, i) => (
        <Message key={i} {...message} />
      ))}
    </div>
  )
}


function Message(message: MessageRow) {
  return (
    <div>
      {message.userId}
      {message.content}
    </div>
  )
}



