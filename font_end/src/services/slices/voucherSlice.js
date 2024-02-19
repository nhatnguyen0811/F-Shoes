import { createSlice } from '@reduxjs/toolkit'

const voucherSilce = createSlice({
  name: 'voucher',
  initialState: [],
  reducers: {
    addVoucher(state, action) {
      state.push(action.payload)
    },

    removeVoucher(state, action) {
      const index = state.findIndex((e) => (e.id = action.payload.id))
      if (index !== -1) {
        state.splice(index, 1)
      }
    },

    updateVoucher(state, action) {
      const itemIndex = state.findIndex((e) => e.id === action.payload.id)
      if (itemIndex !== -1) {
        state[itemIndex] = action.payload
      }
    },
  },
})

const { actions, reducer } = voucherSilce
export const GetVoucher = (state) => state.voucher
export const { addVoucher, removeVoucher, updateVoucher } = actions
export default reducer
