import axiosAdmin from '../../axios'

const voucherApi = {
  getAllVoucher: () => {
    const urlGetAll = `/voucher/view/all`
    return axiosAdmin.get(urlGetAll)
  },
  getAllCustomer: () => {
    const urlGetAll = `/voucher/view/all-customer`
    return axiosAdmin.get(urlGetAll)
  },
  getOneVoucherById: (id) => {
    const urlOneVoucherById = `/voucher/view/one/${id}`
    return axiosAdmin.get(urlOneVoucherById)
  },
  getPageVoucher: (numberPage) => {
    const urlPageVoucher = `/voucher/view/page?numberPage=${numberPage}`
    return axiosAdmin.get(urlPageVoucher)
  },
  addVoucher: (adVoucherRequest) => {
    const urlAddVoucher = `/voucher/add`
    return axiosAdmin.post(urlAddVoucher, adVoucherRequest)
  },
  updateVoucher: (id, adVoucherRequest) => {
    const urlUpdateVoucher = `/voucher/update/${id}`
    return axiosAdmin.put(urlUpdateVoucher, adVoucherRequest)
  },
  deleteVoucher: (id) => {
    const urlDeleteVoucher = `/voucher/delete/${id}`
    return axiosAdmin.delete(urlDeleteVoucher)
  },
  searchVoucher: (adVoucherSearch) => {
    const urlSearchVoucher = `/voucher/search`
    return axiosAdmin.get(urlSearchVoucher, { params: adVoucherSearch })
  },
  getPageCustomer: (filter) => {
    const url = `/voucher/view/all/customer`
    return axiosAdmin.get(url, { params: filter })
  },
  getListIdCustomerByIdVoucher: (idVoucher) => {
    const urlListIdCustomerByIdVoucher = `/customerVoucher/view/list-id-customer/${idVoucher}`
    return axiosAdmin.get(urlListIdCustomerByIdVoucher)
  },
  getAllCodeVoucher: () => {
    const url = `/voucher/view/code-voucher`
    return axiosAdmin.get(url)
  },
  getAllNameVoucher: () => {
    const url = `/voucher/view/name-voucher`
    return axiosAdmin.get(url)
  },
  getAllVoucherByIdCustomer: (adCallVoucherOfSell) => {
    const url = `/voucher/view/voucher-by-customer`
    return axiosAdmin.get(url, { params: adCallVoucherOfSell })
  },
}

export default voucherApi
