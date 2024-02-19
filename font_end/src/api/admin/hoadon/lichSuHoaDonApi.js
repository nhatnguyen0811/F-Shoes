import axiosAdmin from '../../axios'

const lichSuHoaDonApi = {
  getByIdBill: (idBill) => {
    const urlGetByIdBill = `/billHistory/get-by-idBill/${idBill}`
    return axiosAdmin.get(urlGetByIdBill)
  },
}

export default lichSuHoaDonApi
