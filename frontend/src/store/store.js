import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import cartReducer from "./cartSlice"
import menuReducer from "./menuSlice"
import orderReducer from "./orderSlice"
import adminReducer from "./adminSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    menu: menuReducer,
    order: orderReducer,
    admin: adminReducer,
  },
})
