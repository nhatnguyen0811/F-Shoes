import { createSlice } from '@reduxjs/toolkit'

const categorySlice = createSlice({
  name: 'category',
  initialState: [],
  reducers: {
    addCategory(state, action) {
      state.push(action.payload)
    },

    removeCategory(state, action) {
      const index = state.findIndex((e) => (e.id = action.payload.id))
      if (index !== -1) {
        state.splice(index, 1)
      }
    },

    updateCategory(state, action) {
      const itemIndex = state.findIndex((e) => e.id === action.payload.id)
      if (itemIndex !== -1) {
        state[itemIndex] = action.payload
      }
    },
  },
})

const { actions, reducer } = categorySlice
export const GetCategory = (state) => state.category
export const { addCategory, removeCategory, updateCategory } = actions
export default reducer
