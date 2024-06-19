import type { Message } from "@/protocol";
import { client } from "../lib/client";
import { Button, TextInput } from "#/components/Forms";


export function RoomPage() {
  const messageHandler = (message: Message) => {
    console.log(message)
  }
  
  client.onMessage(messageHandler)

  return (
    <div>
      <form>
        <TextInput value={message} label={""} placeholder="Type your message here" onChange={(text) => setMessage(text)} />
        <Button onClick={async () => {
          const channels = await client.api?.channels.get({
            headers: {
              Authorization: `Bearer ${client.authToken}`
            }
          })
          if (!channels || !channels.data) {
            return
          }
          if (channels.data?.length === 0) {
            return
          }

          const status = await client.chat(message, channels.data[0].id)
          if (status !== undefined) {
            console.log("Something went wrong:")
            console.log(status)
          }
        }}>
          Send
        </Button>
      </form>
    </div>
  )
}
