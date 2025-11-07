import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "../api/axiosInstance"

export const fetchCoupons = createAsyncThunk("coupons/fetchCoupons", async () => {
  const response = await axios.get("/coupons/list")
  return response.data
})

export const validateCoupon = createAsyncThunk("coupons/validateCoupon", async ({ code, orderTotal }) => {
  const response = await axios.post("/coupons/validate", { code, orderTotal })
  return response.data
})

export const createCoupon = createAsyncThunk("coupons/createCoupon", async (couponData) => {
  const response = await axios.post("/coupons/create", couponData)
  return response.data
})

const couponSlice = createSlice({
  name: "coupons",
  initialState: {
    list: [],
    applied: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.list = action.payload
        state.loading = false
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.error = action.error.message
        state.loading = false
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.applied = action.payload
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.error = action.error.message
        state.applied = null
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.list.push(action.payload)
      })
  },
})

export default couponSlice.reducer
