import axios from 'axios'
import { getCookie } from '../../services/cookie'
import axiosAdmin, { axiosApi } from '../axios'

const authenticationAPi = {
  loginAdmin: (email, password) => {
    const url = `/authentication/login-admin`
    return axiosApi.post(url, { email: email, password: password })
  },
  login: (email, password) => {
    const url = `/authentication/login`
    return axiosApi.post(url, { email: email, password: password })
  },
  loginGoogle: (email, name, image) => {
    const url = `/authentication/login-google`
    return axiosApi.post(url, { email: email, name: name, image: image })
  },
  register: (email, password, name) => {
    const url = `/authentication/register`
    return axiosApi.post(url, { name: name, email: email, password: password })
  },
  change: (email, password) => {
    const url = `/authentication/change-password`
    return axiosApi.post(url, { name: '', email: email, password: password })
  },
  changePassword: (password, newPassword) => {
    const url = `/authentication/doi-mat-khau`
    return axiosApi.post(url, { password: password, newPassword: newPassword })
  },
  changePasswordAdmin: (password, newPassword) => {
    const url = `/authentication/doi-mat-khau`
    return axiosAdmin.post(url, { password: password, newPassword: newPassword })
  },
  checkMail: (email) => {
    const url = `/authentication/check-mail?email=${email}`
    return axiosApi.get(url)
  },
  sendOtp: (email) => {
    const url = `/authentication/send-otp?email=${email}`
    return axiosApi.get(url)
  },

  getAdmin: (token) => {
    const url = process.env.REACT_APP_API_URL + `/authentication`
    return axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
  },
  getClient: (token) => {
    const url = `/authentication`
    return axiosApi.get(url, { headers: { Authorization: `Bearer ${token}` } })
  },
}
export default authenticationAPi
