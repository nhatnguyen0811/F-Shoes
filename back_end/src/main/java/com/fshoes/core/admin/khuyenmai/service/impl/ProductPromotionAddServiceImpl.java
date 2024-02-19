package com.fshoes.core.admin.khuyenmai.service.impl;

import com.fshoes.core.admin.khuyenmai.model.request.GetProductDetailByIdProduct;
import com.fshoes.core.admin.khuyenmai.model.request.ProductPromotionSearch;
import com.fshoes.core.admin.khuyenmai.model.respone.AddProductPromotionResponse;
import com.fshoes.core.admin.khuyenmai.repository.ProductPromotionAddRepository;
import com.fshoes.core.admin.khuyenmai.service.ProductPromotionAddService;
import com.fshoes.core.common.PageReponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductPromotionAddServiceImpl implements ProductPromotionAddService {

    @Autowired
    private ProductPromotionAddRepository promotionAddRepository;

    @Override
    public PageReponse<AddProductPromotionResponse> getAll(ProductPromotionSearch req) {
        Pageable pageable = PageRequest.of(req.getPage() - 1, req.getSize());
        return new PageReponse<>(promotionAddRepository.getAllProduct(req, pageable));
    }

    @Override
    public PageReponse<AddProductPromotionResponse> getProductDetailByProduct(GetProductDetailByIdProduct req, List<String> id) {
        Pageable pageable = PageRequest.of(req.getPage() - 1, req.getSize());
        return new PageReponse<>(promotionAddRepository.getProductDetailByIdProduct(id, pageable, req));
    }

    @Override
    public PageReponse<AddProductPromotionResponse> getAllProductDetail(ProductPromotionSearch req) {
        Pageable pageable = PageRequest.of(req.getPage() - 1, req.getSize());
        return new PageReponse<>(promotionAddRepository.getAllProductDetail(req, pageable));
    }
}
