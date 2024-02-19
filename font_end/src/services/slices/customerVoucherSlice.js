import { createSlice } from '@reduxjs/toolkit'

const customerVoucherSilce = createSlice({
  name: 'customerVoucher',
  initialState: [],
  reducers: {
    addCustomerVoucher(state, action) {
      state.push(action.payload)
    },

    removeCustomerVoucher(state, action) {
      const index = state.findIndex((e) => (e.id = action.payload.id))
      if (index !== -1) {
        state.splice(index, 1)
      }
    },

    updateCustomerVoucher(state, action) {
      const itemIndex = state.findIndex((e) => e.id === action.payload.id)
      if (itemIndex !== -1) {
        state[itemIndex] = action.payload
      }
    },
  },
})

const { actions, reducer } = customerVoucherSilce
export const GetCustomerVoucher = (state) => state.customerVoucher
export const { addCustomerVoucher, removeCustomerVoucher, updateCustomerVoucher } = actions
export default reducer
