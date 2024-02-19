import { axiosApi } from '../axios'

const clientProductApi = {
  get: (filter) => {
    const url = `/client/product`
    return axiosApi.get(url, { params: filter })
  },
  getAllProduct: (filter) => {
    const url = `/client/all/product`
    return axiosApi.post(url, filter)
  },
  getById: (id) => {
    const url = `/client/product/${id}`
    return axiosApi.get(url)
  },
  getCungLoai: (filter) => {
    const url = `/client/product/cung-loai`
    return axiosApi.get(url, { params: filter })
  },
  getProductHome: (filter) => {
    const url = `/client/product-home`
    return axiosApi.get(url, { params: filter })
  },
  getSellingProduct: (filter) => {
    const url = `/client/selling-product`
    return axiosApi.get(url, { params: filter })
  },
  getSaleProduct: (filter) => {
    const url = `/client/sale-product`
    return axiosApi.get(url, { params: filter })
  },
  getSizes: (request) => {
    const url = `/client/product/size`
    return axiosApi.get(url, { params: request })
  },
  getColors: (request) => {
    const url = `/client/product/color`
    return axiosApi.get(url, { params: request })
  },
  getBrand: () => {
    const url = `/client/brand`
    return axiosApi.get(url)
  },
  getCategory: () => {
    const url = `/client/category`
    return axiosApi.get(url)
  },

  getMaterial: () => {
    const url = `/client/material`
    return axiosApi.get(url)
  },

  getSize: () => {
    const url = `/client/size`
    return axiosApi.get(url)
  },

  getColor: () => {
    const url = `/client/color`
    return axiosApi.get(url)
  },

  getSole: () => {
    const url = `/client/sole`
    return axiosApi.get(url)
  },

  getMinMaxPrice: () => {
    const url = `/client/min-max-price`
    return axiosApi.get(url)
  },
}
export default clientProductApi
