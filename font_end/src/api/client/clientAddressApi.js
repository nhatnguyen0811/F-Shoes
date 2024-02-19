import { axiosApi } from '../axios'

const ClientAddressApi = {
  getAll: (p) => {
    const url = `/client/address/get-all?p=${p}`
    return axiosApi.get(url)
  },
  getById: (id) => {
    const url = `/client/address/get-one/${id}`
    return axiosApi.get(url)
  },
  add: (address) => {
    const url = `/client/address/create`
    return axiosApi.post(url, address)
  },
  update: (id, address) => {
    const url = `/client/address/update/${id}`
    return axiosApi.put(url, address)
  },

  delete: (id) => {
    const url = `/client/address/delete/${id}`
    return axiosApi.delete(url)
  },

  updateStatus: (id) => {
    const url = `/client/address/status?id=${id}`
    return axiosApi.put(url)
  },

  getDefault: () => {
    const url = `/client/address/get-default`
    return axiosApi.get(url)
  },
}
export default ClientAddressApi
