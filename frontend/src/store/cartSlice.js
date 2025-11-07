import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  items: [],
  total: 0,
  coupon: null,
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, name, price, image } = action.payload
      const existing = state.items.find((item) => item.id === id)

      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ id, name, price, image, quantity: 1 })
      }
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find((item) => item.id === id)
      if (item) {
        item.quantity = Math.max(0, quantity)
        if (item.quantity === 0) {
          state.items = state.items.filter((i) => i.id !== id)
        }
      }
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },

    applyCoupon: (state, action) => {
      state.coupon = action.payload
    },

    clearCart: (state) => {
      state.items = []
      state.total = 0
      state.coupon = null
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, applyCoupon, clearCart } = cartSlice.actions
export default cartSlice.reducer
