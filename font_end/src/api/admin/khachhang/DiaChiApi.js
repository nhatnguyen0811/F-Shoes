import axiosAdmin from '../../axios'

const DiaChiApi = {
  getAll: (p, idCustomer) => {
    const url = `/dia-chi/get-all?p=${p}&idCustomer=${idCustomer}`
    return axiosAdmin.get(url)
  },

  get: (filter) => {
    const url = `/dia-chi/get-page`
    return axiosAdmin.get(url, { params: filter })
  },
  getById: (id) => {
    const url = `/dia-chi/get-one/${id}`
    return axiosAdmin.get(url)
  },
  add: (address) => {
    const url = `/dia-chi/create`
    return axiosAdmin.post(url, address)
  },
  update: (id, address) => {
    const url = `/dia-chi/update/${id}`
    return axiosAdmin.put(url, address)
  },

  delete: (id) => {
    const url = `/dia-chi/delete/${id}`
    return axiosAdmin.delete(url)
  },

  updateStatus: (id, idCustomer) => {
    const url = `/dia-chi/status?id=${id}&idCustomer=${idCustomer}`
    return axiosAdmin.put(url)
  },

  getAddressDefault: (idCustomer) => {
    const url = `/dia-chi/get-default?idCustomer=${idCustomer}`
    return axiosAdmin.get(url)
  },
}
export default DiaChiApi
