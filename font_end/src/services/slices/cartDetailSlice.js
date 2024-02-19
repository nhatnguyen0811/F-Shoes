import { createSlice } from '@reduxjs/toolkit'

const cartDetailSilce = createSlice({
  name: 'cartDetail',
  initialState: [],
  reducers: {
    addCartDetail(state, action) {
      state.push(action.payload)
    },

    removeCartDetail(state, action) {
      const index = state.findIndex((e) => (e.id = action.payload.id))
      if (index !== -1) {
        state.splice(index, 1)
      }
    },

    updateCartDetail(state, action) {
      const itemIndex = state.findIndex((e) => e.id === action.payload.id)
      if (itemIndex !== -1) {
        state[itemIndex] = action.payload
      }
    },
  },
})

const { actions, reducer } = cartDetailSilce
export const GetCartDetail = (state) => state.cartDetail
export const { addCartDetail, removeCartDetail, updateCartDetail } = actions
export default reducer
