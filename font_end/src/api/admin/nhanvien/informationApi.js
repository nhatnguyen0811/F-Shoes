import axiosAdmin from '../../axios'

const informationApi = {
  get: (searchStaff) => {
    const url = `/information/search-getPage`
    return axiosAdmin.get(url, { params: searchStaff })
  },

  getAll: () => {
    const url = `/information/find-all`
    return axiosAdmin.get(url)
  },
  getOne: (id) => {
    const url = `/information/detail/${id}`
    return axiosAdmin.get(url)
  },
  add: (staff) => {
    const formData = new FormData()
    formData.append('fullName', staff.fullName)
    formData.append('dateBirth', staff.dateBirth)
    formData.append('phoneNumber', staff.phoneNumber)
    formData.append('email', staff.email)
    formData.append('gender', staff.gender)
    if (staff.avatar !== null) formData.append('avatar', staff.avatar)
    formData.append('CitizenId', staff.citizenId)
    formData.append('role', staff.role)
    const url = `/information/add`
    return axiosAdmin.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  update: (id, staff) => {
    const formData = new FormData()
    formData.append('fullName', staff.fullName)
    formData.append('dateBirth', staff.dateBirth)
    formData.append('phoneNumber', staff.phoneNumber)
    formData.append('email', staff.email)
    formData.append('gender', staff.gender)
    if (staff.avatar !== null && typeof staff.avatar !== 'string') {
      formData.append('avatar', staff.avatar)
    }
    formData.append('CitizenId', staff.citizenId)
    formData.append('role', staff.role)
    formData.append('status', staff.status)
    const url = `/information/update/${id}`
    return axiosAdmin.put(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  },

  delete: (id) => {
    const url = `/information/delete/${id}`
    return axiosAdmin.put(url)
  },
}
export default informationApi
