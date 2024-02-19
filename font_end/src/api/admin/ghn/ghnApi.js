import { axiosApiGhn } from '../../axios'

const ghnAPI = {
  getProvince: () => {
    const url = `/ghn/getProvince`
    return axiosApiGhn.get(url)
  },

  getDistrict: (idProvince) => {
    const url = `/ghn/getDistrict?idProvince=${idProvince}`
    return axiosApiGhn.get(url)
  },

  getWard: (idDistrict) => {
    const url = `/ghn/getWard?idDistrict=${idDistrict}`
    return axiosApiGhn.get(url)
  },

  getTotal: (filterTotal) => {
    const url = `/ghn/getShipping-order`
    return axiosApiGhn.get(url, { params: filterTotal })
  },

  getServiceId: (filtelService) => {
    const url = `/ghn/get-serviceId`
    return axiosApiGhn.get(url, { params: filtelService })
  },

  getime: (filtelTime) => {
    const url = `/ghn/get-time`
    return axiosApiGhn.get(url, { params: filtelTime })
  },
}
export default ghnAPI
