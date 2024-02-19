import { axiosApi } from '../axios'

const clientCheckoutApi = {
  datHang: (request) => {
    const url = `/client/checkout`
    return axiosApi.post(url, request)
  },
  submitOrder: (request) => {
    const url = `/client/checkout/submitOrder`
    return axiosApi.post(url, request)
  },
  payment: (request) => {
    const url = `/client/checkout/payment`
    return axiosApi.get(url, { params: request })
  },
}
export default clientCheckoutApi
