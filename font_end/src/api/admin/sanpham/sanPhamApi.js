import axiosAdmin from '../../axios'

const sanPhamApi = {
  get: (filter) => {
    const url = `/product`
    return axiosAdmin.get(url, { params: filter })
  },
  getList: () => {
    const url = `/product/get-list`
    return axiosAdmin.get(url)
  },
  getListImage: (idColor) => {
    const url = `/product/get-list-image/${idColor}`
    return axiosAdmin.get(url)
  },
  uploadImage: (formData, nameFolder) => {
    const url = `/product/upload-image/${nameFolder}`
    return axiosAdmin.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  addProuct: (request) => {
    const url = `/product/add`
    return axiosAdmin.post(url, request)
  },
  updateProduct: (request) => {
    const url = `/product/update/${request.id}`
    return axiosAdmin.post(url, request)
  },
  updateList: (request) => {
    const url = `/product/update-list`
    return axiosAdmin.post(url, request)
  },
  getProductDetail: (request) => {
    const url = `/product/product-detail`
    return axiosAdmin.get(url, { params: request })
  },
  getNameProduct: (id) => {
    const url = `/product/name-by-id/${id}`
    return axiosAdmin.get(url)
  },
  getAllName: () => {
    const url = `/product/getAllName`
    return axiosAdmin.get(url)
  },

  getImageProduct: (id) => {
    const url = `/product/image-product/${id}`
    return axiosAdmin.get(url)
  },
  updateProductDetail: (id) => {
    const url = `/product/product-detail/${id}`
    return axiosAdmin.get(url)
  },
  deleteProduct: (id) => {
    const url = `/product/delete/${id}`
    return axiosAdmin.delete(url)
  },
  changeStatus: (id) => {
    const url = `/product/change-status/${id}`
    return axiosAdmin.delete(url)
  },
  updateNameProduct: (id, nameProduct) => {
    const url = `/product/update-name/${id}?nameProduct=${nameProduct}`
    return axiosAdmin.put(url)
  },
  filter: (idProduct) => {
    const url = `/product/filter/${idProduct}`
    return axiosAdmin.get(url)
  },
  filterUpadte: (request) => {
    const url = `/product/filterUpdate`
    return axiosAdmin.post(url, request)
  },
}
export default sanPhamApi
