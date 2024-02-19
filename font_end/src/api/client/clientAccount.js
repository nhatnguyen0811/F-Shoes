import { axiosApi } from '../axios'

const ClientAccountApi = {
  getAllBill: (filter) => {
    const url = `/client/customer/all-bill`
    return axiosApi.get(url, { params: filter })
  },
  getAllBillTable: (filter) => {
    const url = `/client/customer/all-bill-table`
    return axiosApi.get(url, { params: filter })
  },
  getAllBillReturn: () => {
    const url = `/client/customer/all-bill-return`
    return axiosApi.get(url)
  },
  getBillDetailByIdBill: (idBill) => {
    const url = `/client/customer/get-by-idBill/${idBill}`
    return axiosApi.get(url)
  },
  getBillHistoryByIdBill: (idBill) => {
    const url = `/client/customer/get-bill-history-by-idBill/${idBill}`
    return axiosApi.get(url)
  },
  getTransactionByIdBill: (idBill) => {
    const url = `/client/customer/get-transaction-by-idBill/${idBill}`
    return axiosApi.get(url)
  },

  getBillDetailByCode: (code) => {
    const url = `/client/customer/get-by-code/${code}`
    return axiosApi.get(url)
  },
  getBillHistoryByCode: (code) => {
    const url = `/client/customer/get-bill-history-by-code/${code}`
    return axiosApi.get(url)
  },
  getBillClient: (idBill) => {
    const url = `/client/customer/get-client-billResponse/${idBill}`
    return axiosApi.get(url)
  },
  updateInfBill: (idBill, clientBillReq) => {
    const url = `/client/customer/update-inf-bill/${idBill}`
    return axiosApi.put(url, clientBillReq)
  },
  saveBillDetail: (billDetailReq) => {
    const url = `/client/customer/save-billDetail`
    return axiosApi.post(url, billDetailReq)
  },
  deleteBillDetail: (id) => {
    const url = `/client/customer/delete-billDetail/${id}`
    return axiosApi.delete(url)
  },
  cancelBill: (idBill, clientCancelBillReq) => {
    const url = `/client/customer/cancel-bill/${idBill}`
    return axiosApi.put(url, clientCancelBillReq)
  },
  findAllBrand: () => {
    const url = `/client/customer/find-all-brand`
    return axiosApi.get(url)
  },
  findAllMaterial: () => {
    const url = `/client/customer/get-list-material`
    return axiosApi.get(url)
  },
  findAllColor: () => {
    const url = `/client/customer/find-all-color`
    return axiosApi.get(url)
  },
  findAllSole: () => {
    const url = `/client/customer/find-all-sole`
    return axiosApi.get(url)
  },
  findAllCategory: () => {
    const url = `/client/customer/find-all-category`
    return axiosApi.get(url)
  },
  findAllSize: () => {
    const url = `/client/customer/find-all-size`
    return axiosApi.get(url)
  },
  getAllProduct: () => {
    const url = `/client/customer/getProduct`
    return axiosApi.get(url)
  },
  getBillHByIdBill: (idBill) => {
    const urlGetByIdBill = `/client/customer/get-billHistory-by-idBill/${idBill}`
    return axiosApi.get(urlGetByIdBill)
  },
}
export default ClientAccountApi
