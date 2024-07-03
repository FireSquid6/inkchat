import { treaty } from "@elysiajs/eden"
import type { App } from "@/index"
import { socketFromAddress, urlFromAddress } from "./address"
import { createContext, useContext, useState } from "react"
import { connectSignal, disconnectSignal } from "./signals"


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

  })
  disconnectSignal.subscribe(() => {
    setState(initialState)
  })

  return <ConnectionContext.Provider value={state}>{children}</ConnectionContext.Provider>
}



