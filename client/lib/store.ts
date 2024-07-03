import { configureStore } from "@reduxjs/toolkit"
import { serverSlice } from "./server"


export const store = configureStore({
  reducer: {
    server: serverSlice.reducer,
  }
})
