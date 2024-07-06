import type { MessageRow } from "@/db/schema"

export function ChannelPage() {
  return (
    <div className="flex flex-col h-full">
      <Topbar />
      <div className="overflow-y-auto h-full">
        <Messages />
      </div>
      <MesssageInput />
    </div>
  )
}


function MesssageInput() {
  return (
    <div className="w-[90%] mx-auto my-4">
      <input type="text" className="input w-full"/>
    </div>
  )
}

function Topbar() {
  return (
    <div className="navbar bg-base-200">
      <div className="flex-1">
        <h1 className="btn btn-ghost text-xl">Channel Name</h1>
      </div>
      <div className="flex-none">
        <button className="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
          </svg>
        </button>
      </div>
    </div>
  )
}


function Messages() {
  const messages: MessageRow[] = [
    {
      id: "sdkflsdjlf",
      content: "Hello world!",
      createdAt: 123456,
      channelId: "doesn'tmatter",
      userId: "soemthing",
    },
    {
      id: "sdkflsdjlf",
      content: "Hello world! 2",
      createdAt: 7812,
      channelId: "doesn'tmatter",
      userId: "soemthing",
    },
    {
      id: "sdkflsdjlf",
      content: "some other message",
      createdAt: 1234,
      channelId: "doesn'tmatter",
      userId: "soemthing",
    },
    {
      id: "sdkflsdjlf",
      content: "some other message 2",
      createdAt: 1123918245712,
      channelId: "doesn'tmatter",
      userId: "soemthing",
    },
    {
      id: "12slkdg",
      content: "this is a really long message. The person just kept going I guess with nothing better to do. Truly, the person who wrote this is a terrible writer and always writes way to many words despite not needing to. With all of these words the writer accomplishes absolutely nothing but wasting the reader's time. Maybe melville is in my chat app.",
      createdAt: 123456,
      channelId: "doesn'tmatter",
      userId: "soemthing",
    }
  ]

  return (
    <div className="h-full">
      <span h-full />
      {messages.map((message, i) => (
        <Message key={i} message={message} />
      ))}
    </div>
  )
}


function Message({ message }: { message: MessageRow }) {
  return (
    <div className="flex m-4">
      <div className="flex-none">
        <img src="https://avatars.dicebear.com/api/avataaars/1234.svg" alt="avatar" className="w-10 h-10 rounded-full" />
      </div>
      <div>
        <p className="text-sm ml-2">
          <span className="font-bold">{message.userId}</span>
          <span className="ml-4 text-primary">06/12/2025 04:13</span>
        </p>
        <p className="h-full align-middle ml-4">{message.content}</p>
      </div>
    </div>
  )
}
