import { createSlice } from '@reduxjs/toolkit'

const addressSilce = createSlice({
  name: 'address',
  initialState: [],
  reducers: {
    addAddress(state, action) {
      state.push(action.payload)
    },

    removeAddress(state, action) {
      const index = state.findIndex((e) => (e.id = action.payload.id))
      if (index !== -1) {
        state.splice(index, 1)
      }
    },

    updateAddress(state, action) {
      const itemIndex = state.findIndex((e) => e.id === action.payload.id)
      if (itemIndex !== -1) {
        state[itemIndex] = action.payload
      }
    },
  },
})

const { actions, reducer } = addressSilce
export const GetAddress = (state) => state.address
export const { addAddress, removeAddress, updateAddress } = actions
export default reducer
