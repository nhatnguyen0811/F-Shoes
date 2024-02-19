import axiosAdmin from '../../axios'
const khachHangApi = {
  getOne: (id) => {
    const url = `/khach-hang/get-one/${id}`
    return axiosAdmin.get(url)
  },

  get: (searchKhachHang) => {
    const url = `/khach-hang/search`
    return axiosAdmin.get(url, { params: searchKhachHang })
  },

  getAll: () => {
    const url = `/khach-hang/get-all`
    return axiosAdmin.get(url)
  },

  addKhachHang: (khachhang) => {
    const formData = new FormData()
    formData.append('fullName', khachhang.fullName)
    formData.append('dateBirth', khachhang.dateBirth)
    formData.append('phoneNumber', khachhang.phoneNumber)
    formData.append('email', khachhang.email)
    formData.append('gender', khachhang.gender)
    if (khachhang.avatar !== null) formData.append('avatar', khachhang.avatar)
    formData.append('role', khachhang.role)
    const url = `/khach-hang/create`
    return axiosAdmin.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  },

  delete: (id) => {
    const url = `/khach-hang/delete/${id}`
    return axiosAdmin.delete(url)
  },
  updateKhachHang: (id, khachhang) => {
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
    const url = `/khach-hang/update/${id}`
    return axiosAdmin.put(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
}
export default khachHangApi
