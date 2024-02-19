import { createSlice } from '@reduxjs/toolkit'

const promotionSilce = createSlice({
  name: 'promotion',
  initialState: [],
  reducers: {
    addPromotion(state, action) {
      state.push(action.payload)
    },

    removePromotion(state, action) {
      const index = state.findIndex((e) => (e.id = action.payload.id))
      if (index !== -1) {
        state.splice(index, 1)
      }
    },

    updatePromotion(state, action) {
      const itemIndex = state.findIndex((e) => e.id === action.payload.id)
      if (itemIndex !== -1) {
        state[itemIndex] = action.payload
      }
    },
  },
})

const { actions, reducer } = promotionSilce
export const GetPromotion = (state) => state.promotion
export const { addPromotion, removePromotion, updatePromotion } = actions
export default reducer
