import axiosAdmin from '../../axios'

const bradApi = {
  findAll: () => {
    const url = `/brand/find-all`
    return axiosAdmin.get(url)
  },
  getList: () => {
    const url = `/brand/get-list`
    return axiosAdmin.get(url)
  },
  getBrand: (filter) => {
    const url = `/brand`
    return axiosAdmin.get(url, { params: filter })
  },
  addBrand: (brand) => {
    const url = `/brand/add`
    return axiosAdmin.post(url, brand)
  },
  updateBrand: (id, brand) => {
    const url = `/brand/update/${id}`
    return axiosAdmin.put(url, brand)
  },
  swapBrand: (id) => {
    const url = `/brand/swap/${id}`
    return axiosAdmin.delete(url)
  },
  getAllNameBrand: () => {
    const url = `/brand/get-all-name`
    return axiosAdmin.get(url)
  },
}
export default bradApi
