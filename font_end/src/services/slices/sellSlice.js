import { createSlice } from '@reduxjs/toolkit'

const sellSilce = createSlice({
  name: 'sell',
  initialState: [],
  reducers: {
    addSell(state, action) {
      state.push(action.payload)
    },

    removeSell(state, action) {
      const index = state.findIndex((e) => (e.id = action.payload.id))
      if (index !== -1) {
        state.splice(index, 1)
      }
    },

    updateSell(state, action) {
      const itemIndex = state.findIndex((e) => e.id === action.payload.id)
      if (itemIndex !== -1) {
        state[itemIndex] = action.payload
      }
    },
  },
})

const { actions, reducer } = sellSilce
export const GetSell = (state) => state.sell
export const { addSell, removeSell, updateSell } = actions
export default reducer
