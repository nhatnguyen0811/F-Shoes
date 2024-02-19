import { createSlice } from '@reduxjs/toolkit'

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: [],
  reducers: {
    setCheckout(state, action) {
      return action.payload
    },
  },
})

const { actions, reducer } = checkoutSlice
export const GetCheckout = (state) => state.checkout
export const { setCheckout } = actions
export default reducer
