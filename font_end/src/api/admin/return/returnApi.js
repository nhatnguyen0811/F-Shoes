import axiosAdmin from '../../axios'
const BASE_URL = '/returns'
const returnApi = {
  getReturnDetail: (id) => {
    const url = `${BASE_URL}/detail/${id}`
    return axiosAdmin.get(url)
  },
  getBill: (filter) => {
    const url = `${BASE_URL}/bill`
    return axiosAdmin.get(url, { params: filter })
  },
  getBillId: (id) => {
    const url = `${BASE_URL}/bill-id/${id}`
    return axiosAdmin.get(url)
  },
  getBillDetail: (id) => {
    const url = `${BASE_URL}/bill-detail/${id}`
    return axiosAdmin.get(url)
  },
  accept: (request) => {
    const url = `${BASE_URL}/accept`
    return axiosAdmin.post(url, request)
  },
}
export default returnApi
