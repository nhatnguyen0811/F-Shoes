import { createSlice } from '@reduxjs/toolkit'

const accountSilce = createSlice({
  name: 'account',
  initialState: [],
  reducers: {
    addAccount(state, action) {
      state.push(action.payload)
    },

    removeAccount(state, action) {
      const index = state.findIndex((e) => (e.id = action.payload.id))
      if (index !== -1) {
        state.splice(index, 1)
      }
    },

    updateAccount(state, action) {
      const itemIndex = state.findIndex((e) => e.id === action.payload.id)
      if (itemIndex !== -1) {
        state[itemIndex] = action.payload
      }
    },
  },
})

const { actions, reducer } = accountSilce
export const GetAccount = (state) => state.account
export const { addAccount, removeAccount, updateAccount } = actions
export default reducer
