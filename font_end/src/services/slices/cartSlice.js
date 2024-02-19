import { createSlice } from '@reduxjs/toolkit'
import clientCartApi from '../../api/client/clientCartApi'
import { getCookie } from '../cookie'
const token = getCookie('ClientToken')
const cartSlice = createSlice({
  name: 'cart',
  initialState: JSON.parse(localStorage.getItem('cart')) || [],
  reducers: {
    setCartLogout(state, action) {
      localStorage.removeItem('cart')
      return action.payload
    },
    setCart(state, action) {
      localStorage.setItem('cart', JSON.stringify(action.payload))
      if (token) {
        clientCartApi.set(action.payload).catch(() => {})
      }
      return action.payload
    },
    addCart(state, action) {
      const index = state.findIndex((e) => e.id === action.payload.id)
      if (index !== -1) {
        state[index].soLuong = state[index].soLuong + action.payload.soLuong
      } else {
        state.push(action.payload)
      }
      if (token) {
        clientCartApi.set(state).catch(() => {})
      }
      localStorage.setItem('cart', JSON.stringify(state))
    },
    removeCart(state, action) {
      const index = state.findIndex((e) => e.id === action.payload.id)
      if (index !== -1) {
        state.splice(index, 1)
        localStorage.setItem('cart', JSON.stringify(state))
        if (token) {
          clientCartApi.set(state).catch(() => {})
        }
      }
    },
    updateCart(state, action) {
      const itemIndex = state.findIndex((e) => e.id === action.payload.id)
      if (itemIndex !== -1) {
        state[itemIndex] = action.payload
        localStorage.setItem('cart', JSON.stringify(state))
        if (token) {
          clientCartApi.set(state).catch(() => {})
        }
      }
    },
  },
})

const { actions, reducer } = cartSlice
export const GetCart = (state) => state.cart
export const { addCart, removeCart, updateCart, setCart, setCartLogout } = actions
export default reducer
