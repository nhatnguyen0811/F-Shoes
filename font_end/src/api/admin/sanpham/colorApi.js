import axiosAdmin from '../../axios'
const BASE_URL = '/color'
const colorApi = {
  findAll: () => {
    const url = `${BASE_URL}/find-all`
    return axiosAdmin.get(url)
  },
  getList: () => {
    const url = `${BASE_URL}/get-list`
    return axiosAdmin.get(url)
  },
  getColor: (filter) => {
    const url = `${BASE_URL}`
    return axiosAdmin.get(url, { params: filter })
  },
  addColor: (color) => {
    const url = `${BASE_URL}/add`
    return axiosAdmin.post(url, color)
  },
  updateColor: (id, color) => {
    const url = `${BASE_URL}/update/${id}`
    return axiosAdmin.put(url, color)
  },
  swapColor: (id) => {
    const url = `${BASE_URL}/swap/${id}`
    return axiosAdmin.delete(url)
  },
  getAllCodeColor: () => {
    const url = `${BASE_URL}/get-all-code`
    return axiosAdmin.get(url)
  },
  getAllNameColor: () => {
    const url = `${BASE_URL}/get-all-name`
    return axiosAdmin.get(url)
  },
}
export default colorApi
