import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../api/axiosInstance"

export const fetchMenuItems = createAsyncThunk("menu/fetchMenuItems", async (category, { rejectWithValue }) => {
  try {
    const url = category ? `/menu?category=${category}` : "/menu"
    const { data } = await axiosInstance.get(url)
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to fetch menu")
  }
})

export const createMenuItem = createAsyncThunk("menu/createMenuItem", async (item, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post("/menu", item)
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to create item")
  }
})

export const updateMenuItem = createAsyncThunk(
  "menu/updateMenuItem",
  async ({ id, ...updates }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/menu/${id}`, updates)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to update item")
    }
  },
)

export const deleteMenuItem = createAsyncThunk("menu/deleteMenuItem", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/menu/${id}`)
    return id
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to delete item")
  }
})

const initialState = {
  items: [],
  loading: false,
  error: null,
  categories: [],
}

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuItems.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.categories = [...new Set(action.payload.map((item) => item.category))]
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createMenuItem.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        if (index >= 0) state.items[index] = action.payload
      })
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
  },
})

export default menuSlice.reducer
