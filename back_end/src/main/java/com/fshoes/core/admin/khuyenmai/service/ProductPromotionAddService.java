package com.fshoes.core.admin.khuyenmai.service;

import com.fshoes.core.admin.khuyenmai.model.request.GetProductDetailByIdProduct;
import com.fshoes.core.admin.khuyenmai.model.request.ProductPromotionSearch;
import com.fshoes.core.admin.khuyenmai.model.respone.AddProductPromotionResponse;
import com.fshoes.core.common.PageReponse;

import java.util.List;

public interface ProductPromotionAddService {

    PageReponse<AddProductPromotionResponse> getAllProductDetail(ProductPromotionSearch req);

    PageReponse<AddProductPromotionResponse> getAll(ProductPromotionSearch req);

    PageReponse<AddProductPromotionResponse> getProductDetailByProduct(GetProductDetailByIdProduct req, List<String> id);
}
