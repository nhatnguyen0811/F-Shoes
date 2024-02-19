import { createSlice } from '@reduxjs/toolkit'

const colorSlice = createSlice({
  name: 'color',
  initialState: [],
  reducers: {
    addColor(state, action) {
      state.push(action.payload)
    },

    removeColor(state, action) {
      const index = state.findIndex((e) => (e.id = action.payload.id))
      if (index !== -1) {
        state.splice(index, 1)
      }
    },

    updateColor(state, action) {
      const itemIndex = state.findIndex((e) => e.id === action.payload.id)
      if (itemIndex !== -1) {
        state[itemIndex] = action.payload
      }
    },
  },
})

const { actions, reducer } = colorSlice
export const GetColor = (state) => state.color
export const { addColor, removeColor, updateColor } = actions
export default reducer
