import { AuthPage } from "./pages/Auth"
import { RoomPage } from "./pages/Room";
import { useState } from "react"
import { client } from "./lib/client"


function App() {
  const [isConnected, setIsConnected] = useState(false)
  client.onConnect((connected) => {
    setIsConnected(connected)
  })

  return (
    <>
      {isConnected ? <RoomPage /> : <AuthPage />}
    </>
  )
}

export default App
