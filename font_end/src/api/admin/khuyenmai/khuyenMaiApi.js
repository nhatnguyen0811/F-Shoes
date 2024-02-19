import axiosAdmin from '../../axios'
const khuyenMaiApi = {
  getAll: () => {
    const GetAll = `/promotion/get-all`
    return axiosAdmin.get(GetAll)
  },

  getAllProduct: (filter) => {
    const GetAll = `/promotion/get-product`
    return axiosAdmin.get(GetAll, { params: filter })
  },
  getAllProductDetail: (filterDetail) => {
    const GetAllDtail = `/promotion/get-product-detail`
    return axiosAdmin.get(GetAllDtail, { params: filterDetail })
  },

  getAllProductDetailByProduct: (filterDetailByProduct, id) => {
    const GetAllDtail = `/promotion/get-product-detail-by-product/${id}`
    return axiosAdmin.get(GetAllDtail, { params: filterDetailByProduct })
  },

  getPage: (totalPages) => {
    const urlPage = `/promotion/get-page`
    return axiosAdmin.get(urlPage, totalPages)
  },

  getAllPromotion: (filter) => {
    const urlPage = `/promotion/get-Promotion-filter`
    return axiosAdmin.get(urlPage, { params: filter })
  },

  getById: (id) => {
    const getPageById = `/promotion/get-one/${id}`
    return axiosAdmin.get(getPageById)
  },

  getProductAndProductDetailById: (idPromotion) => {
    const getProductById = `/product-promotion/list-product/${idPromotion}`
    return axiosAdmin.get(getProductById)
  },

  getProductDetailById: (idPromotion) => {
    const getProductById = `/product-promotion/list-product-detail/${idPromotion}`
    return axiosAdmin.get(getProductById)
  },

  addPromotion: (Promotion) => {
    const urlAddPromotion = `/promotion/add`
    return axiosAdmin.post(urlAddPromotion, Promotion)
  },

  addProductPromotion: (ProductPromotion) => {
    const urlAddPromotion = `/promotion/add-product-promotion`
    return axiosAdmin.post(urlAddPromotion, ProductPromotion)
  },

  UpdayePromotion: (UpdatePromotionRe, id) => {
    const urlUpdatePromotion = `/promotion/update/${id}`
    return axiosAdmin.put(urlUpdatePromotion, UpdatePromotionRe, id)
  },

  searchPromotionByName: (page, textSearch) => {
    const urlSearchPromotion = `/promotion/search-by-name?page=${page}&textSearch=${textSearch}`
    return axiosAdmin.get(urlSearchPromotion)
  },
  deletePromotion: (id) => {
    const urlDeletePromotion = `/promotion/delete/${id}`
    return axiosAdmin.put(urlDeletePromotion)
  },
  exportExcel: () => {
    const urlDeletePromotion = `/promotion/export-excel`
    return axiosAdmin.post(urlDeletePromotion)
  },
}

export default khuyenMaiApi
