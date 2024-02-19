import axiosAdmin from '../../axios'

const sizeApi = {
  findAll: () => {
    const url = `/size/find-all`
    return axiosAdmin.get(url)
  },
  getList: () => {
    const url = `/size/get-list`
    return axiosAdmin.get(url)
  },
  getSize: (filter) => {
    const url = `/size`
    return axiosAdmin.get(url, { params: filter })
  },
  addSize: (size) => {
    const url = `/size/add`
    return axiosAdmin.post(url, size)
  },
  updateSize: (id, size) => {
    const url = `/size/update/${id}`
    return axiosAdmin.put(url, size)
  },
  swapSize: (id) => {
    const url = `/size/swap/${id}`
    return axiosAdmin.delete(url)
  },
  getAllNameSize: () => {
    const url = `/size/get-all-name`
    return axiosAdmin.get(url)
  },
}
export default sizeApi
