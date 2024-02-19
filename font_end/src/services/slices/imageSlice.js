import { createSlice } from '@reduxjs/toolkit'

const imageSilce = createSlice({
  name: 'image',
  initialState: [],
  reducers: {
    addImage(state, action) {
      state.push(action.payload)
    },

    removeImage(state, action) {
      const index = state.findIndex((e) => (e.id = action.payload.id))
      if (index !== -1) {
        state.splice(index, 1)
      }
    },

    updateImage(state, action) {
      const itemIndex = state.findIndex((e) => e.id === action.payload.id)
      if (itemIndex !== -1) {
        state[itemIndex] = action.payload
      }
    },
  },
})

const { actions, reducer } = imageSilce
export const GetImage = (state) => state.image
export const { addImage, removeImage, updateImage } = actions
export default reducer
