import { axiosAdminHoaDon } from '../../axios'
const hoaDonApi = {
  getOne: (id) => {
    const urlGetOne = `/bill/get/${id}`
    return axiosAdminHoaDon.get(urlGetOne)
  },
  checkBillExist: (id) => {
    const urlGetOne = `/bill/check-bill-exist/${id}`
    return axiosAdminHoaDon.get(urlGetOne)
  },
  getBillFilter: (filterBill) => {
    const url = `/bill/filter`
    return axiosAdminHoaDon.get(url, { params: filterBill })
  },
  confirmBill: (idBill, billConfirmRequest) => {
    const url = `/bill/confirm-order/${idBill}`
    return axiosAdminHoaDon.put(url, billConfirmRequest)
  },
  updateStatusBill: (idBill, updateBillRequest) => {
    const url = `/bill/update-status/${idBill}`
    return axiosAdminHoaDon.put(url, updateBillRequest)
  },
  confirmPayment: (idBill, confirmPaymentRequest) => {
    const url = `/bill/confirm-payment/${idBill}`
    return axiosAdminHoaDon.put(url, confirmPaymentRequest)
  },
  updateBillDetail: (idBill, lstBillDetailRequest) => {
    const url = `/bill/update-billDetail/${idBill}`
    return axiosAdminHoaDon.put(url, lstBillDetailRequest)
  },
  cancelBill: (idBill, updateBillRequest) => {
    const url = `/bill/cancel/${idBill}`
    return axiosAdminHoaDon.put(url, updateBillRequest)
  },
  update: (idBill, hdBillReq) => {
    const url = `/bill/update/${idBill}`
    return axiosAdminHoaDon.put(url, hdBillReq)
  },
  printBill: (idBill) => {
    const url = `/bill/print-bill/${idBill}`
    return axiosAdminHoaDon.post(url)
  },
  returnStt: (idBill, hdBillReq) => {
    const url = `/bill/return-stt/${idBill}`
    return axiosAdminHoaDon.put(url, hdBillReq)
  },
  getNhanVien: (idBill, searchNhanVien) => {
    const url = `/bill/get-list-staff/${idBill}`
    return axiosAdminHoaDon.get(url, { params: searchNhanVien })
  },
  addStaffReception: (idBill, idAcc) => {
    const url = `/bill/add-staff-reception-bill/${idBill}/${idAcc}`
    return axiosAdminHoaDon.put(url)
  },
  capNhatPhiShip: (idBill, phiShip) => {
    const url = `/bill/capNhatPhiShip/${idBill}?phiShip=${phiShip}`
    return axiosAdminHoaDon.put(url)
  },
  changeMoneyBill: (idBill, request) => {
    const url = `bill/change-money-bill/${idBill}`
    return axiosAdminHoaDon.put(url, request)
  },
}

export default hoaDonApi
