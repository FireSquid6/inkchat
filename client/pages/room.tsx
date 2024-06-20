import { Button } from "#/components/form"
import { client } from "#/lib/client"
import { setPage } from "#/lib/ui"
import Html from "@kitajs/html"

export function setRoomPage() {
  setPage(Room())

  setupChannels()
}



function Room() {
  return (
    <div class="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content flex flex-col items-center justify-center">
        <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">Open drawer</label>
      </div>
      <div class="drawer-side">
        <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
        <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <div id="channelsContainer">

          </div>
        </ul>
      </div>
    </div>

  )
}


interface ChannelProps {
  name: string
  id: string
}

function Channel(props: ChannelProps) {
  return (
    <Button>{Html.escapeHtml(props.name)}</Button>
  )
}

async function setupChannels() {
  const res = await client.api?.channels.get()
  const channelsContainer = document.getElementById("channelsContainer")

  if (!channelsContainer) {
    console.error("channelsContainer not found")
    return
  }

  // TODO: log errors here
  if (!res) {
    return
  }

  // and here
  if (res.data === null) {
    return
  }
  
  for (const channel of res.data) {
    const channelElement = Channel({
      name: channel.name,
      id: channel.id
    })

    channelsContainer.innerHTML += channelElement

  }
}
