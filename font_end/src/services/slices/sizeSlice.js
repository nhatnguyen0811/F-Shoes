import { createSlice } from '@reduxjs/toolkit'

const sizeSlice = createSlice({
  name: 'size',
  initialState: [],
  reducers: {
    addSize(state, action) {
      state.push(action.payload)
    },

    removeSize(state, action) {
      const index = state.findIndex((e) => (e.id = action.payload.id))
      if (index !== -1) {
        state.splice(index, 1)
      }
    },

    updateSize(state, action) {
      const itemIndex = state.findIndex((e) => e.id === action.payload.id)
      if (itemIndex !== -1) {
        state[itemIndex] = action.payload
      }
    },
  },
})

const { actions, reducer } = sizeSlice
export const GetSize = (state) => state.size
export const { addSize, removeSize, updateSize } = actions
export default reducer
