import { useRef, useState, useSyncExternalStore } from "react"
import { messagesStore, connectionStore, updateMessages, usersStore } from '@/lib/store'
import { createFileRoute } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { MessageRow } from 'api'

export const Route = createFileRoute('/server/$address/$channel')({
  component: () => <ChannelComponent />,
  beforeLoad: ({ location }) => {
    console.log("before load")
    const channelId = location.pathname.split("/").pop() || ""
    const {data: connection } = connectionStore.state

    if (connection !== null) {
      console.log("updating messages")
      updateMessages(connection, channelId)
    }
  }
})


function ChannelComponent() {
  const channelId = Route.useParams().channel

  return (
    <div className="h-full flex flex-col">
      <Messages channelId={channelId} />
      <ChatInput channelId={channelId} />
    </div>
  )
}

function useMessagesStore() {
  // ugly callback hell
  return useSyncExternalStore((listener) => { 
    console.log("the function you passed to syncExternalStore is being called")
    const unsubscribe = messagesStore.subscribe(() => {
      console.log("wrapper around the listener is being called")
      listener()
    })

    return () => {
      console.log("unsubscribe is being called")
      unsubscribe()
    }
  }, () => messagesStore.state)
}

function Messages(props: { channelId: string }) {
  const dummyDiv = useRef<HTMLDivElement | null>(null)
  const currentMessages = useMessagesStore()

  let messages = currentMessages.get(props.channelId)
  console.log(messages)

  if (messages === undefined) {
    messages = []
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto m-4">
      {messages.map((message, i) => (
        <Message key={i} {...message} />
      ))}
      <div ref={dummyDiv} />
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



function ChatInput(props: { channelId: string }) {
  const [message, setMessage] = useState("")
  const { data: connection, error } = useStore(connectionStore)
  const onClick = () => {
    if (connection === null) {
      console.error(error)
      return
    }

    connection.sendMessage(props.channelId, message)
    setMessage("")
  }


  return (
    <div className="flex flex-row m-2">
      <input type="text" value={message} onKeyUp={(e) => {
        if (e.key === "Enter") {
          onClick()
        }
      }} onChange={(e) => setMessage(e.target.value)} className="input input-primary input-bordered w-full mr-2" />
      <button disabled={connection === null} onClick={onClick} className="btn btn-primary">Send</button>
    </div>
  )
}
