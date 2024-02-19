import { createSlice } from '@reduxjs/toolkit'

const productSilce = createSlice({
  name: 'product',
  initialState: [],
  reducers: {
    addProduct(state, action) {
      state.push(action.payload)
    },

    removeProduct(state, action) {
      const index = state.findIndex((e) => (e.id = action.payload.id))
      if (index !== -1) {
        state.splice(index, 1)
      }
    },

    updateProduct(state, action) {
      const itemIndex = state.findIndex((e) => e.id === action.payload.id)
      if (itemIndex !== -1) {
        state[itemIndex] = action.payload
      }
    },
  },
})

const { actions, reducer } = productSilce
export const GetProduct = (state) => state.product
export const { addProduct, removeProduct, updateProduct } = actions
export default reducer
