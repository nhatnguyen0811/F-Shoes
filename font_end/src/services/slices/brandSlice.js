import { createSlice } from '@reduxjs/toolkit'

const brandSlice = createSlice({
  name: 'brand',
  initialState: [],
  reducers: {
    addBrand(state, action) {
      state.push(action.payload)
    },

    removeBrand(state, action) {
      const index = state.findIndex((e) => (e.id = action.payload.id))
      if (index !== -1) {
        state.splice(index, 1)
      }
    },

    updateBrand(state, action) {
      const itemIndex = state.findIndex((e) => e.id === action.payload.id)
      if (itemIndex !== -1) {
        state[itemIndex] = action.payload
      }
    },
  },
})

const { actions, reducer } = brandSlice
export const GetBrand = (state) => state.brand
export const { addBrand, removeBrand, updateBrand } = actions
export default reducer
