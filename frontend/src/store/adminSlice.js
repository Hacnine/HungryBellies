import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../api/axiosInstance"

export const fetchAllOrders = createAsyncThunk("admin/fetchAllOrders", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get("/admin/orders")
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to fetch orders")
  }
})

export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/admin/orders/${orderId}/status`, { status })
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to update order")
    }
  },
)

export const fetchAdminStats = createAsyncThunk("admin/fetchAdminStats", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get("/admin/stats")
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to fetch stats")
  }
})

export const fetchAllDrivers = createAsyncThunk("admin/fetchAllDrivers", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get("/drivers")
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to fetch drivers")
  }
})

export const createDriver = createAsyncThunk("admin/createDriver", async (driverData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post("/drivers", driverData)
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to create driver")
  }
})

const initialState = {
  orders: [],
  drivers: [],
  stats: null,
  selectedOrder: null,
  loading: false,
  error: null,
}

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex((o) => o.id === action.payload.id)
        if (index >= 0) state.orders[index] = action.payload
        if (state.selectedOrder?.id === action.payload.id) {
          state.selectedOrder = action.payload
        }
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.stats = action.payload
      })
      .addCase(fetchAllDrivers.fulfilled, (state, action) => {
        state.drivers = action.payload
      })
      .addCase(createDriver.fulfilled, (state, action) => {
        state.drivers.push(action.payload)
      })
  },
})

export const { setSelectedOrder } = adminSlice.actions
export default adminSlice.reducer
