import { createSlice } from '@reduxjs/toolkit'

const productDetailSilce = createSlice({
  name: 'productDetail',
  initialState: [],
  reducers: {
    addProductDetail(state, action) {
      state.push(action.payload)
    },

    removeProductDetail(state, action) {
      const index = state.findIndex((e) => (e.id = action.payload.id))
      if (index !== -1) {
        state.splice(index, 1)
      }
    },

    updateProductDetail(state, action) {
      const itemIndex = state.findIndex((e) => e.id === action.payload.id)
      if (itemIndex !== -1) {
        state[itemIndex] = action.payload
      }
    },
  },
})

const { actions, reducer } = productDetailSilce
export const GetProductDetail = (state) => state.productDetail
export const { addProductDetail, removeProductDetail, updateProductDetail } = actions
export default reducer
