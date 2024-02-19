import { createSlice } from '@reduxjs/toolkit'

const appSlice = createSlice({
  name: 'app',
  initialState: [],
  reducers: {
    setApp(state, action) {
      return action.payload
    },
  },
})

const { actions, reducer } = appSlice
export const GetApp = (state) => state.app
export const { setApp } = actions
export default reducer
