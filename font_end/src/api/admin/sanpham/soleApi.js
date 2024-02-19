import axiosAdmin from '../../axios'

const soleApi = {
  findAll: () => {
    const url = `/sole/find-all`
    return axiosAdmin.get(url)
  },
  getList: () => {
    const url = `/sole/get-list`
    return axiosAdmin.get(url)
  },
  getSole: (filter) => {
    const url = `/sole`
    return axiosAdmin.get(url, { params: filter })
  },
  addSole: (sole) => {
    const url = `/sole/add`
    return axiosAdmin.post(url, sole)
  },
  updateSole: (id, sole) => {
    const url = `/sole/update/${id}`
    return axiosAdmin.put(url, sole)
  },
  swapSole: (id) => {
    const url = `/sole/swap/${id}`
    return axiosAdmin.delete(url)
  },
  getAllNameSole: () => {
    const url = `/sole/get-all-name`
    return axiosAdmin.get(url)
  },
}
export default soleApi
