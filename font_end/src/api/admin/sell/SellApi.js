import axiosAdmin from '../../axios'

const sellApi = {
  getAllProduct: (filter) => {
    const urlGetAll = `/sell/getProduct`
    return axiosAdmin.get(urlGetAll, { params: filter })
  },
  getProduct: (id) => {
    const urlGet = `/sell/get-product/${id}`
    return axiosAdmin.get(urlGet)
  },
  getMinMaxPrice: () => {
    const urlGet = `/sell/get-min-max-price`
    return axiosAdmin.get(urlGet)
  },

  getAllBillId: (idBill) => {
    const urlGetAll = `/sell/get-one-bill?idBill=${idBill}`
    return axiosAdmin.get(urlGetAll)
  },

  getBillById: (idBill) => {
    const urlGetAll = `/sell/get-product-cart?idBill=${idBill}`
    return axiosAdmin.get(urlGetAll)
  },

  getAllBillTaoDonHang: () => {
    const urlGetAll = `/sell/get-all-bill-tao-don-hang`
    return axiosAdmin.get(urlGetAll)
  },

  getAllCustomer: () => {
    const urlGetAll = `/sell/getCustomer`
    return axiosAdmin.get(urlGetAll)
  },

  addBillDetail: (billDetail, id) => {
    const urlGetAll = `/sell/add-product-sell/${id}`
    return axiosAdmin.post(urlGetAll, billDetail)
  },

  addBillDetailByIdProductDetail: (idProductDetail, id) => {
    const urlGetAll = `/sell/add-product-sell-by-id/${id}?idProductDetail=${idProductDetail}`
    return axiosAdmin.post(urlGetAll)
  },

  createBill: () => {
    const url = `/sell/create-bill`
    return axiosAdmin.post(url)
  },
  deleteBill: (id) => {
    const url = `/sell/delete-bill/${id}`
    return axiosAdmin.delete(url)
  },
  deleteTransaction: (idBill) => {
    const url = `/sell/delete-transaction/${idBill}`
    return axiosAdmin.delete(url)
  },
  getPayOrderByIdBill: (idBill) => {
    const url = `/sell/get-pay_order/${idBill}`
    return axiosAdmin.get(url)
  },
  getTotalMoneyPayOrderByIdBill: (idBill) => {
    const url = `/sell/get-total-money-pay_order/${idBill}`
    return axiosAdmin.get(url)
  },
  getProductDetailBill: (id) => {
    const url = `/sell/get-product-detail-bill/${id}`
    return axiosAdmin.get(url)
  },

  getSize: () => {
    const url = `/sell/get-size`
    return axiosAdmin.get(url)
  },
  getColor: () => {
    const url = `/sell/get-color`
    return axiosAdmin.get(url)
  },
  getAount: (id) => {
    const url = `/sell/get-amount/${id}`
    return axiosAdmin.get(url)
  },

  addBill: (data, id) => {
    const url = `/sell/add-bill/${id}`
    return axiosAdmin.put(url, data)
  },

  addAddressBill: (data, id) => {
    const url = `/sell/add-address-bill/${id}`
    return axiosAdmin.put(url, data)
  },
  payOrder: (data, id) => {
    const url = `/sell/pay-order/${id}`
    return axiosAdmin.put(url, data)
  },

  updateQuantityProductDetail: (id, quantity) => {
    const url = `/sell/update-quantity-product-detail/${id}?quantity=${quantity}`
    return axiosAdmin.put(url)
  },

  rollBackQuantityProductDetail: (idBill, idPrDetail) => {
    const url = `/sell/roll-back-quantity-product-detail?idBill=${idBill}&idPrDetail=${idPrDetail}`
    return axiosAdmin.put(url)
  },

  deleteProductDetail: (idBill, idPrDetail) => {
    const url = `/sell/delete-product-detail-by-bill?idBill=${idBill}&idPrDetail=${idPrDetail}`
    return axiosAdmin.delete(url)
  },

  increaseQuantityBillDetail: (idBillDetail, idPrDetail) => {
    const url = `/sell/increase-quantity-bill-detail?idBillDetail=${idBillDetail}&idPrDetail=${idPrDetail}`
    return axiosAdmin.put(url)
  },
  decreaseQuantityBillDetail: (idBillDetail, idPrDetail) => {
    const url = `/sell/decrease-quantity-bill-detail?idBillDetail=${idBillDetail}&idPrDetail=${idPrDetail}`
    return axiosAdmin.put(url)
  },

  inputQuantityBillDetail: (idBillDetail, idPrDetail, quantity) => {
    const url = `/sell/input-quantity-bill-detail?idBillDetail=${idBillDetail}&idPrDetail=${idPrDetail}&quantity=${quantity}`
    return axiosAdmin.put(url)
  },

  getNameProduct: () => {
    const url = `/sell/max-price`
    return axiosAdmin.get(url)
  },
  getAllVoucherByIdCustomer: (adCallVoucherOfSell) => {
    const url = `/sell/view/voucher-by-customer`
    return axiosAdmin.get(url, { params: adCallVoucherOfSell })
  },
  getListVoucherByIdCustomer: (adCallVoucherOfSell) => {
    const url = `/sell/view/list/voucher-by-customer`
    return axiosAdmin.get(url, { params: adCallVoucherOfSell })
  },
  getListVoucherByIdCustomerUnqualified: (adCallVoucherOfSell) => {
    const url = `/sell/view/list/voucher-by-customer-unqualified`
    return axiosAdmin.get(url, { params: adCallVoucherOfSell })
  },
  getOneVoucherById: (id) => {
    const urlOneVoucherById = `/sell/view/one/voucher/${id}`
    return axiosAdmin.get(urlOneVoucherById)
  },
}
export default sellApi
