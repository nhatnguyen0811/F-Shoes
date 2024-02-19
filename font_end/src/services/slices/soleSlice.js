import { createSlice } from '@reduxjs/toolkit'

const soleSlice = createSlice({
  name: 'sole',
  initialState: [],
  reducers: {
    addSole(state, action) {
      state.push(action.payload)
    },

    removeSole(state, action) {
      const index = state.findIndex((e) => (e.id = action.payload.id))
      if (index !== -1) {
        state.splice(index, 1)
      }
    },

    updateSole(state, action) {
      const itemIndex = state.findIndex((e) => e.id === action.payload.id)
      if (itemIndex !== -1) {
        state[itemIndex] = action.payload
      }
    },
  },
})

const { actions, reducer } = soleSlice
export const GetSole = (state) => state.sole
export const { addSole, removeSole, updateSole } = actions
export default reducer
