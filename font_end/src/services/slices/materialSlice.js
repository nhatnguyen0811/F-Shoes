import { createSlice } from '@reduxjs/toolkit'

const materialSlice = createSlice({
  name: 'material',
  initialState: [],
  reducers: {
    addMaterial(state, action) {
      state.push(action.payload)
    },

    removeMaterial(state, action) {
      const index = state.findIndex((e) => (e.id = action.payload.id))
      if (index !== -1) {
        state.splice(index, 1)
      }
    },

    updateMaterial(state, action) {
      const itemIndex = state.findIndex((e) => e.id === action.payload.id)
      if (itemIndex !== -1) {
        state[itemIndex] = action.payload
      }
    },
  },
})

const { actions, reducer } = materialSlice
export const GetMaterial = (state) => state.material
export const { addMaterial, removeMaterial, updateMaterial } = actions
export default reducer
