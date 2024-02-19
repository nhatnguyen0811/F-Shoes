import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    addUser(state, action) {
      return action.payload
    },

    removeUser(state, action) {
      return null
    },
  },
})

const { actions, reducer } = userSlice
export const GetUser = (state) => state.user
export const { addUser, removeUser } = actions
export default reducer
