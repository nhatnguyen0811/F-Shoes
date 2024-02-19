import { createSlice } from '@reduxjs/toolkit'

const billDetailSilce = createSlice({
  name: 'billDetail',
  initialState: [],
  reducers: {
    addBillDetail(state, action) {
      state.push(action.payload)
    },

    removeBillDetail(state, action) {
      const index = state.findIndex((e) => (e.id = action.payload.id))
      if (index !== -1) {
        state.splice(index, 1)
      }
    },

    updateBillDetail(state, action) {
      const itemIndex = state.findIndex((e) => e.id === action.payload.id)
      if (itemIndex !== -1) {
        state[itemIndex] = action.payload
      }
    },
  },
})

const { actions, reducer } = billDetailSilce
export const GetBillDetail = (state) => state.billDetail
export const { addBillDetail, removeBillDetail, updateBillDetail } = actions
export default reducer
