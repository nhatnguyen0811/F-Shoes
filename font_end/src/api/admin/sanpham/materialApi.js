import axiosAdmin from '../../axios'

const materialApi = {
  findAll: () => {
    const url = `/material/find-all`
    return axiosAdmin.get(url)
  },
  getList: () => {
    const url = `/material/get-list`
    return axiosAdmin.get(url)
  },
  getMaterial: (filter) => {
    const url = `/material`
    return axiosAdmin.get(url, { params: filter })
  },
  addMaterial: (material) => {
    const url = `/material/add`
    return axiosAdmin.post(url, material)
  },
  updateMaterial: (id, material) => {
    const url = `/material/update/${id}`
    return axiosAdmin.put(url, material)
  },
  swapMaterial: (id) => {
    const url = `/material/swap/${id}`
    return axiosAdmin.delete(url)
  },
  getAllNameMaterial: () => {
    const url = `/material/get-all-name`
    return axiosAdmin.get(url)
  },
}
export default materialApi
