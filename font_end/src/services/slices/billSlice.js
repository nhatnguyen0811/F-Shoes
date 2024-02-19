import { createSlice } from '@reduxjs/toolkit'

const billSilce = createSlice({
  name: 'bill',
  initialState: [],
  reducers: {
    addBill(state, action) {
      state.push(action.payload)
    },

    removeBill(state, action) {
      const index = state.findIndex((e) => (e.id = action.payload.id))
      if (index !== -1) {
        state.splice(index, 1)
      }
    },

    updateBill(state, action) {
      const itemIndex = state.findIndex((e) => e.id === action.payload.id)
      if (itemIndex !== -1) {
        state[itemIndex] = action.payload
      }
    },
  },
})

const { actions, reducer } = billSilce
export const GetBill = (state) => state.bill
export const { addBill, removeBill, updateBill } = actions
export default reducer
