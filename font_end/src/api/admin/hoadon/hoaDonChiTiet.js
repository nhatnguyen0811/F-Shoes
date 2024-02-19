import { axiosAdminHoaDon } from '../../axios'

const hoaDonChiTietApi = {
  getByIdBillAndStt: (idBill, status) => {
    const urlGetByIdBill = `/billDetail/get-by-idBill-and-status/${idBill}`
    return axiosAdminHoaDon.get(urlGetByIdBill, { params: { status } })
  },
  getByIdBill: (idBill) => {
    const urlGetByIdBill = `/billDetail/get-by-idBill/${idBill}`
    return axiosAdminHoaDon.get(urlGetByIdBill)
  },
  decrementQuantity: (idBillDetail) => {
    const url = `/billDetail/decrementQuantity/${idBillDetail}`
    return axiosAdminHoaDon.put(url)
  },
  incrementQuantity: (idBillDetail) => {
    const url = `/billDetail/incrementQuantity/${idBillDetail}`
    return axiosAdminHoaDon.put(url)
  },
  changeQuantity: (idBillDetail, quantity) => {
    const url = `/billDetail/changeQuantity/${idBillDetail}`
    return axiosAdminHoaDon.put(url, quantity)
  },
  saveBillDetail: (billDetailReq) => {
    const url = `/billDetail/save`
    return axiosAdminHoaDon.post(url, billDetailReq)
  },
  delete: (id) => {
    const url = `/billDetail/delete/${id}`
    return axiosAdminHoaDon.put(url)
  },
  returnProduct: (idBillDetail, hdBillDetailReq) => {
    const url = `/billDetail/return-product/${idBillDetail}`
    return axiosAdminHoaDon.put(url, hdBillDetailReq)
  },
  getByIdBillAndIdPrd: (idBill, idPrd) => {
    const urlGetByIdBill = `/billDetail/get-by-billAndProductDetail`
    return axiosAdminHoaDon.get(urlGetByIdBill, { params: { idBill, idPrd } })
  },
  getByIdBillAndIdPrdAndPrice: (idBill, idPrd, price) => {
    const urlGetByIdBillPrdAndPrice = `/billDetail/get-by-billAndProductDetailAndPrice`
    return axiosAdminHoaDon.get(urlGetByIdBillPrdAndPrice, { params: { idBill, idPrd, price } })
  },
  // isCheckDonGiaVsPricePrd: (id) => {
  //   const url = `/billDetail/getHDPrdRes/${id}`
  //   return axiosAdminHoaDon.get(url)
  // },
  isCheckDonGiaVsPricePrd: (id) => {
    const url = `/billDetail/isCheckDonGiaVsPricePrd/${id}`
    return axiosAdminHoaDon.get(url)
  },
  getVoucherByIdBill: (idBill) => {
    const urlGetByIdBillPrdAndPrice = `/billDetail/get/voucher/by/idBill/${idBill}`
    return axiosAdminHoaDon.get(urlGetByIdBillPrdAndPrice)
  },
  getPercentByIdBill: (idBill) => {
    const urlGetByIdBillPrdAndPrice = `/billDetail/get/percent/by/idBill/${idBill}`
    return axiosAdminHoaDon.get(urlGetByIdBillPrdAndPrice)
  },
  getOneVoucherById: (idVoucher) => {
    const urlOneVoucherById = `/billDetail/view/one/voucher/${idVoucher}`
    return axiosAdminHoaDon.get(urlOneVoucherById)
  },
}

export default hoaDonChiTietApi
