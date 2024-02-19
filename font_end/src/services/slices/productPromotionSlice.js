import { createSlice } from '@reduxjs/toolkit'

const productPromotionSilce = createSlice({
  name: 'productPromotion',
  initialState: [],
  reducers: {
    addProductPromotion(state, action) {
      state.push(action.payload)
    },

    removeProductPromotion(state, action) {
      const index = state.findIndex((e) => (e.id = action.payload.id))
      if (index !== -1) {
        state.splice(index, 1)
      }
    },

    updateProductPromotion(state, action) {
      const itemIndex = state.findIndex((e) => e.id === action.payload.id)
      if (itemIndex !== -1) {
        state[itemIndex] = action.payload
      }
    },
  },
})

const { actions, reducer } = productPromotionSilce
export const GetProductPromotion = (state) => state.productPromotion
export const { addProductPromotion, removeProductPromotion, updateProductPromotion } = actions
export default reducer
