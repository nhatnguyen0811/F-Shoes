import axiosAdmin from '../../axios'

const lichSuGiaoDichApi = {
  getByIdBill: (idBill) => {
    const urlGetByIdBill = `/transaction/get-by-idBill/${idBill}`
    return axiosAdmin.get(urlGetByIdBill)
  },
}

export default lichSuGiaoDichApi
