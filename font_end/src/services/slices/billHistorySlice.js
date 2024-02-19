import { createSlice } from '@reduxjs/toolkit'

const billHistorySilce = createSlice({
  name: 'billHistory',
  initialState: [],
  reducers: {
    addBillHistory(state, action) {
      state.push(action.payload)
    },

    removeBillHistory(state, action) {
      const index = state.findIndex((e) => (e.id = action.payload.id))
      if (index !== -1) {
        state.splice(index, 1)
      }
    },

    updateBillHistory(state, action) {
      const itemIndex = state.findIndex((e) => e.id === action.payload.id)
      if (itemIndex !== -1) {
        state[itemIndex] = action.payload
      }
    },
  },
})

const { actions, reducer } = billHistorySilce
export const GetBillHistory = (state) => state.billHistory
export const { addBillHistory, removeBillHistory, updateBillHistory } = actions
export default reducer
