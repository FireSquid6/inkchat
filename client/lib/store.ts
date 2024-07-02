import { configureStore} from "@reduxjs/toolkit"
import { addressSlice } from "./address"


export const store = configureStore({
  reducer: {
    server: addressSlice.reducer
  }
})



