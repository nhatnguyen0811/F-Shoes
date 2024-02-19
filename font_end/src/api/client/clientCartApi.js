import { axiosApi } from '../axios'

const clientCartApi = {
  get: () => {
    const url = `/client/cart`
    return axiosApi.get(url)
  },
  getPromotionByProductDetail: (idProductDetail) => {
    const url = `/client/cart/get-promotion-by-product-detail/${idProductDetail}`
    return axiosApi.get(url)
  },
  add: (cart) => {
    const url = `/client/cart/add`
    return axiosApi.post(url, { idProduct: cart.id, amount: cart.soLuong })
  },
  set: (list) => {
    const url = `/client/cart/set`
    return axiosApi.post(
      url,
      list.map((cart) => {
        return { idProduct: cart.id, amount: cart.soLuong }
      }),
    )
  },
}
export default clientCartApi
