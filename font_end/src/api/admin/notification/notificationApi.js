import { axiosApiThongBao } from '../../axios'

const notificationApi = {
  save: (request) => {
    const url = `/notification/save`
    return axiosApiThongBao.post(url, request)
  },
  read: (id) => {
    const url = `/notification/read/${id}`
    return axiosApiThongBao.put(url)
  },
  getAll: () => {
    const url = `/notification`
    return axiosApiThongBao.get(url)
  },
}
export default notificationApi
