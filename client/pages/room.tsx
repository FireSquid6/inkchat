import { setPage } from "#/lib/ui"
import Html from "@kitajs/html"

export function setRoomPage() {
  setPage(Room())
}



function Room() {
  return (
    <main>
      <p>This is the room page</p>
    </main>
  )
}
