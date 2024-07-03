import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { treaty } from "@elysiajs/eden"
import type { App } from "@/index"

export function urlFromAddress(address: string): string {
  if (address.startsWith("localhost")) {
    return `http://${address}`
  }
  return `https://${address}`
}

export function socketFromAddress(address: string): string {
  if (address.startsWith("localhost")) {
    return `ws://${address}/socket`
  }
  return `wss://${address}/socket`
}

type ConnectActionPayload = {
  token: string
  address: string
}

type ServerState = {
  address: string
  url: string
  socketUrl: string
  active: boolean 

  api: ReturnType<typeof treaty<App>> | null
  socket: WebSocket | null
}

const initialState: ServerState = {
  address: "",
  url: "",
  socketUrl: "",
  active: false,
  
  api: null,
  socket: null
}

export const serverSlice = createSlice({
  name: "server",
  initialState,
  reducers: {
    connect: (state, action: PayloadAction<ConnectActionPayload>) => {
      state.address = action.payload.address
      state.url = urlFromAddress(action.payload.address)
      state.socketUrl = socketFromAddress(action.payload.address)

      state.api = treaty<App>(state.url)

    },
    disconnect: (state) => {
      state.socket?.close()
      state = initialState
    }
  }
})

