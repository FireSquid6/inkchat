import { treaty } from "@elysiajs/eden"
import type { App } from "@/index"
import { createContext, useContext, useState } from "react"
import { connectSignal, disconnectSignal } from "./signals"
import { socketFromAddress, urlFromAddress } from "./address"
import { clientMessages } from "@/protocol"


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

  connectSignal.subscribe(({ address, token }) => {
    const url = urlFromAddress(address)
    const socketUrl = socketFromAddress(address)

    const api = treaty<App>(url)
    const socket = new WebSocket(socketUrl)
    console.log(socket) 

    socket.on("open", () => {
      setState({ ...state, active: true })

      socket.send(clientMessages.connect.make({
        authorization: `Bearer ${token}`,
      }))
    })
    socket.on("close", () => {
      setState({ ...state, socket: null, active: false })
    })
    socket.on("error", () => {
      setState({ ...state, error: "Socket error" })
    })
    socket.on("message", (message) => {
      // do something
      console.log(message.toString())

    })

    setState({
      address,
      url,
      socketUrl,

      active: false,
      error: "",
      token,

      api,
      socket,
    })

  })
  disconnectSignal.subscribe(() => {
    state.socket?.close()
    setState(initialState)
  })

  return <ConnectionContext.Provider value={state}>{children}</ConnectionContext.Provider>
}




export function useConnection() {
  return useContext(ConnectionContext)
}
