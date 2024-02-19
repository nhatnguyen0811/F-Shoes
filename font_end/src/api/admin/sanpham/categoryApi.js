import axiosAdmin from '../../axios'

const categoryApi = {
  findAll: () => {
    const url = `/category/find-all`
    return axiosAdmin.get(url)
  },
  getList: () => {
    const url = `/category/get-list`
    return axiosAdmin.get(url)
  },
  getCategory: (filter) => {
    const url = `/category`
    return axiosAdmin.get(url, { params: filter })
  },
  addCategory: (category) => {
    const url = `/category/add`
    return axiosAdmin.post(url, category)
  },
  updateCategory: (id, category) => {
    const url = `/category/update/${id}`
    return axiosAdmin.put(url, category)
  },
  swapCategory: (id) => {
    const url = `/category/swap/${id}`
    return axiosAdmin.delete(url)
  },
  getAllNameCategory: () => {
    const url = `/category/get-all-name`
    return axiosAdmin.get(url)
  },
}
export default categoryApi
