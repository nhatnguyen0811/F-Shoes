package com.fshoes.core.admin.khuyenmai.service;

import com.fshoes.core.admin.khuyenmai.model.request.ProductPromotionRequest;
import com.fshoes.entity.ProductPromotion;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface ProductPromotionService {

    List<ProductPromotion> getAll();


    Optional<ProductPromotion> getOne(String id);

    ProductPromotion addProductPromotion(ProductPromotionRequest productPromotionRequest);

    ProductPromotion updateProductPromotion(ProductPromotionRequest productPromotionRequest, String id);

    Page<ProductPromotion> ProductPromotionPage(Integer page, Integer pageSize);


    List<String> getIdProductAndProductDetailByIdPromotion(String idPromotion);

    List<String> getIdProductDetailByIdPromotion(String idPromotion);

}
