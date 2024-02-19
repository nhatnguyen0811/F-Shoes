import { axiosApi } from '../axios'

const ClientAccountApi = {
  getOne: () => {
    const url = `/client/customer/get-one`
    return axiosApi.get(url)
  },

  update: (khachhang) => {
    const formData = new FormData()
    formData.append('fullName', khachhang.fullName)
    formData.append('dateBirth', khachhang.dateBirth)
    formData.append('phoneNumber', khachhang.phoneNumber)
    formData.append('email', khachhang.email)
    formData.append('gender', khachhang.gender)
    if (khachhang.avatar !== null && typeof khachhang.avatar !== 'string') {
      formData.append('avatar', khachhang.avatar)
    }
    formData.append('role', khachhang.role)
    formData.append('status', khachhang.status)
    const url = `/client/customer/update`
    return axiosApi.put(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  },

  getAll: () => {
    const url = `/client/customer/get-all`
    return axiosApi.get(url)
  },
}
export default ClientAccountApi
