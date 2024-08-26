import { useRef, useState } from "react"
import {
  connectionStore,
  updateMessages,
  usersStore,
  useMessagesStore
} from "@/lib/store"
import { createFileRoute } from "@tanstack/react-router"
import { useStore } from "@tanstack/react-store"
import { MessageRow, PublicUser } from "api"
import { parseMarkdown } from "@/lib/markdown"
import { ProfilePicture } from "@/components/profile-picture"
import { ProfileCard } from "@/components/profile-card"

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
  const modalRef = useRef<HTMLDialogElement | null>(null)
  const [connection] = useStore(connectionStore)
  if (connection === null) {
    throw new Error("Shouldn't be here")
  }

  const currentMessages = useMessagesStore(() => {
    // ugly! terrible! I should be shot for this!
    setTimeout(() => {
      if (dummyDiv.current !== null) {
        dummyDiv.current.scrollIntoView({ behavior: "auto" })
      }
    }, 1)
  })

  let messages = currentMessages.get(props.channelId)
  const [selectedUser, setSelectedUser] = useState<PublicUser>({
    username: "Unknown User",
    id: "12345",
    isAdmin: false,
  })

  if (messages === undefined) {
    messages = []
  }

  return (
    <>
      <dialog id="profile-modal" className="modal" ref={modalRef}>
        <div className="modal-box">
          <h2>Profile for {selectedUser.displayName ?? selectedUser.username}</h2>
          <ProfileCard {...selectedUser} avatarUrl={connection.getAvatarUrl(selectedUser.id)} />
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </dialog>
      <div className="flex flex-col h-full overflow-y-auto m-4">
        {messages.map((message, i) => (
          <Message key={i} {...message} onClick={() => {
            const user = usersStore.state.find((u) => u.id === message.userId)
            if (user) {
              setSelectedUser(user)
            } else {
              setSelectedUser({
                username: "Unknown User",
                id: "12345",
                isAdmin: false,
              })
            }
            
            modalRef.current?.showModal()
          }} />
        ))}
        <div ref={dummyDiv} />
      </div>
    </>
  )
}

function Message(props: MessageRow & { onClick?: () => void }) {
  const users = useStore(usersStore)

  const user = users.find((u) => u.id === props.userId)
  const html = parseMarkdown(props.content)
  const dateTime = new Date(props.createdAt).toLocaleString()
  // TODO - render the message content using some sort of markdown system
  // probably need a custom compiler for this to be honest.
  const onClick = () => {
    if (props.onClick) {
      props.onClick()
    }
  }

  return (
    <div className="flex flex-row">
      <ProfilePicture className="m-4 mt-4" avatarUrl={""} username={user?.username ?? "Unknown User"} width={64} height={64} />

      <div className="flex flex-col mt-6">
        <div className="flxe flex-row">
          <button onClick={onClick} className="text-primary hover:underline">{user?.displayName ?? `@${user?.username}` ?? <i>"Unknown User"</i>}</button>
          <span className="mx-2">-</span>
          <span className="ml-auto text-neutral">{dateTime}</span>
        </div>
        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  )
}

function ChatInput(props: { channelId: string }) {
  const [message, setMessage] = useState("")
  const [connection, error] = useStore(connectionStore)
  const textarea = useRef<HTMLTextAreaElement | null>(null)
  const onClick = () => {
    if (connection === null) {
      console.error(error)
      return
    }

    if (message.length === 0 || message === "\n") {
      setMessage("")
      return
    }

    connection.sendMessage(props.channelId, message)

  }

  return (
    <div className="flex flex-row m-2">
      <textarea
        ref={textarea}
        value={message}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            if (e.shiftKey) {
              return
            }
            onClick()
            setMessage("")
          }
        }}
        onChange={(e) => {
          const area = textarea.current!

          area.style.height = "auto"
          area.style.height = `${Math.min(area.scrollHeight, 200)}px`
          setMessage(e.target.value)}}
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
