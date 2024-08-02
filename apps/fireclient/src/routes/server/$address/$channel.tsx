import { printDebug } from '@/lib/debug'
import { useState } from "react"
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
    <div className="h-full flex flex-col">
      <div className="flex flex-col h-full overflow-y-auto m-4">
        {messages.map((message, i) => (
          <Message key={i} {...message} />
        ))}
      </div>
      <ChatInput />
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
        <span className="text-primary">{user?.username ?? "Unknown User"}</span>
        <span className="mx-2">-</span>
        <span className="ml-auto text-neutral">{dateTime}</span>
      </div>
      <p className="ml-2">{message.content}</p>
    </div>
  )
}



function ChatInput() {
  const [message, setMessage] = useState("")

  return (
    <div className="flex flex-row m-2">
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} className="input input-primary input-bordered w-full mr-2" />
      <button className="btn btn-primary">Send</button>
    </div>
  )
}
