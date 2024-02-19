import { axiosApi } from '../axios'

const ClientVoucherApi = {
  fetchVoucher: (request) => {
    const url = `/client/voucher/view/voucher-by-customer`
    return axiosApi.get(url, { params: request })
  },
  voucherByCode: (code) => {
    const url = `/client/voucher/view/voucher-by-code/${code}`
    return axiosApi.get(url)
  },
  getVoucherPublicMyProfile: () => {
    const url = `/client/voucher/view/voucher-profile-public`
    return axiosApi.get(url)
  },
  getVoucherPrivateMyProfile: () => {
    const url = `/client/voucher/view/voucher-profile-private`
    return axiosApi.get(url)
  },
}
export default ClientVoucherApi
