import { useRef, useState } from "react"
import {
  connectionStore,
  updateMessages,
  usersStore,
  useMessagesStore
} from "@/lib/store"
import { createFileRoute } from "@tanstack/react-router"
import { useStore } from "@tanstack/react-store"
import { MessageRow } from "api"
import { parseMarkdown } from "@/lib/markdown"

export const Route = createFileRoute("/server/$address/$channel")({
  component: () => <ChannelComponent />,
  beforeLoad: ({ location }) => {
    const channelId = location.pathname.split("/").pop() || ""
    const [connection] = connectionStore.state

    if (connection !== null) {
      updateMessages(connection, channelId)
    }
  }
})

function ChannelComponent() {
  const channelId = Route.useParams().channel

  return (
    <>
      <Messages channelId={channelId} />
      <ChatInput channelId={channelId} />
    </>
  )
}

function Messages(props: { channelId: string }) {
  const dummyDiv = useRef<HTMLDivElement | null>(null)
  const currentMessages = useMessagesStore(() => {
    // ugly! terrible! I should be shot for this!
    setTimeout(() => {
      if (dummyDiv.current !== null) {
        dummyDiv.current.scrollIntoView({ behavior: "auto" })
      }
    }, 1)
  })

  let messages = currentMessages.get(props.channelId)

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
  const html = parseMarkdown(message.content)
  const dateTime = new Date(message.createdAt).toLocaleString()
  // TODO - render the message content using some sort of markdown system
  // probably need a custom compiler for this to be honest.
  return (
    <div className="flex flex-col mt-6">
      <div className="flxe flex-row">
        <span className="text-primary">{user?.displayName ?? user?.username ?? <i>"Unknown User"</i>}</span>
        <span className="mx-2">-</span>
        <span className="ml-auto text-neutral">{dateTime}</span>
      </div>
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

function ChatInput(props: { channelId: string }) {
  const [message, setMessage] = useState("")
  const [connection, error] = useStore(connectionStore)
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
      <textarea
        value={message}
        placeholder="Type a message..."
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            if (e.shiftKey) {
              setMessage((prev) => prev + "\n")
              return
            }
            onClick()
          }
        }}
        onChange={(e) => setMessage(e.target.value)}
        className="input input-primary input-bordered w-full mr-2"
      />
      <button
        disabled={connection === null}
        onClick={onClick}
        className="btn btn-primary"
      >
        Send
      </button>
    </div>
  )
}
