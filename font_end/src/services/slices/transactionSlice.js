import { createSlice } from '@reduxjs/toolkit'

const transactionSilce = createSlice({
  name: 'transaction',
  initialState: [],
  reducers: {
    addTransaction(state, action) {
      state.push(action.payload)
    },

    removeTransaction(state, action) {
      const index = state.findIndex((e) => (e.id = action.payload.id))
      if (index !== -1) {
        state.splice(index, 1)
      }
    },

    updateTransaction(state, action) {
      const itemIndex = state.findIndex((e) => e.id === action.payload.id)
      if (itemIndex !== -1) {
        state[itemIndex] = action.payload
      }
    },
  },
})

const { actions, reducer } = transactionSilce
export const GetTransaction = (state) => state.transaction
export const { addTransaction, removeTransaction, updateTransaction } = actions
export default reducer
