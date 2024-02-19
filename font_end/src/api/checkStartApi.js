import { axiosApi } from './axios'

const checkStartApi = {
  check: () => {
    const url = `/check-start`
    return axiosApi.get(url)
  },
  checkQuantiy: (id, quantity) => {
    const url = `/check-start/check-quantity`
    return axiosApi.get(url, { params: { id: id, quantity: quantity } })
  },
}
export default checkStartApi
