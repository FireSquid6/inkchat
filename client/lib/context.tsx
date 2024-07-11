import { treaty } from "@elysiajs/eden"
import type { App } from "@/index"
import { createContext, useContext, useState } from "react"
import { socketFromAddress, urlFromAddress } from "./address"
import { clientMessages } from "@/protocol"
import { useLocation } from "react-router-dom"
import { getStoredSessions } from "./auth"
import { isSome } from "@/maybe"


export type ConnectionState = {
  address: string
  url: string
  socketUrl: string
  token: string

  active: boolean
  error: string

  socket: WebSocket | null
  api: ReturnType<typeof treaty<App>> | null
}

export type Session = {
  address: string
  token: string
}

const initialState: ConnectionState = {
  address: "",
  url: "",
  socketUrl: "",
  token: "",

  active: false,
  error: "",

  socket: null,
  api: null,
}


const ConnectionContext = createContext<ConnectionState>(initialState)
export function ConnectionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConnectionState>(initialState)

  const location = useLocation()
  const address = location.pathname.split("/")[1]
  const res = getStoredSessions()
  let sessions: Session[] = []

  if (isSome(res)) {
    sessions = res.data
  }

  const session = sessions.find((session) => session.address === address)
  if (!session) {
    state.socket?.close()
    setState(initialState)

  } else {
    const token = session.token
    const url = urlFromAddress(address)
    const socketUrl = socketFromAddress(address)

    const api = treaty<App>(url)
    const socket = new WebSocket(socketUrl)

    socket.onopen = () => {
      setState({
        address: address,
        url: url,
        socketUrl: socketUrl,

        active: true,
        error: "",
        token: token,

        api: api,
        socket: socket,
      })

      socket.send(clientMessages.connect.make({
        authorization: `Bearer ${token}`,
      }))
    }
    socket.onclose = () => {
      setState({ ...state, socket: null, active: false })
    }
    socket.onerror = () => {
      setState({ ...state, error: "Socket error" })
    }
    socket.onmessage = (message) => {
      // do something
      console.log(message.toString())

    }
    console.log(address)
  }

  return <ConnectionContext.Provider value={state}>{children}</ConnectionContext.Provider>
}




export function useConnection() {
  return useContext(ConnectionContext)
}
