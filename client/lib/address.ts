import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

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

type AddressState = {
  address: string
  url: string
  socketUrl: string
}

const initialState: AddressState = {
  address: "",
  url: "",
  socketUrl: "",
}

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setAddress: (state: AddressState, action: PayloadAction<string>): void => {
      state.address = action.payload
      state.url = urlFromAddress(action.payload)
      state.socketUrl = socketFromAddress(action.payload)
    },
  }
})

