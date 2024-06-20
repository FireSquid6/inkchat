import './style.css'
import { setAuthPage } from "#/pages/auth"
import { client } from "#/lib/client"
import { setRoomPage } from './pages/room'


client.onConnect((connected) => {
  if (connected) {
    setRoomPage()
  } else {
    setAuthPage()
  }
})

setAuthPage()
