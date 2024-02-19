import { createSlice } from '@reduxjs/toolkit'

const userAdminSlice = createSlice({
  name: 'userAdmin',
  initialState: null,
  reducers: {
    addUserAdmin(state, action) {
      return action.payload
    },

    removeUserAdmin(state, action) {
      return null
    },
  },
})

const { actions, reducer } = userAdminSlice
export const GetUserAdmin = (state) => state.userAdmin
export const { addUserAdmin, removeUserAdmin } = actions
export default reducer
