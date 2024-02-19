package com.fshoes.core.admin.khuyenmai.service.impl;

import com.fshoes.core.admin.khuyenmai.model.request.ProductPromotionRequest;
import com.fshoes.core.admin.khuyenmai.repository.KMProductPromotionRepository;
import com.fshoes.core.admin.khuyenmai.service.ProductPromotionService;
import com.fshoes.entity.ProductPromotion;
import com.fshoes.repository.ProductPromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductPromotionServiceImpl implements ProductPromotionService {

    @Autowired
    private ProductPromotionRepository productPromotionRepository;

    @Autowired
    private KMProductPromotionRepository kmProductPromotionRepository;

    @Override
    public List<ProductPromotion> getAll() {
        return productPromotionRepository.findAll();
    }

    @Override
    public Optional<ProductPromotion> getOne(String id) {
        return productPromotionRepository.findById(id);
    }

    @Override
    public ProductPromotion addProductPromotion(ProductPromotionRequest productPromotionRequest) {
        ProductPromotion productPromotion = productPromotionRequest.newProductProduct(new ProductPromotion());
        return productPromotionRepository.save(productPromotion);
    }

    @Override
    public ProductPromotion updateProductPromotion(ProductPromotionRequest productPromotionRequest, String id) {
        if (productPromotionRepository.existsById(id)) {
            ProductPromotion productPromotion = productPromotionRequest.newProductProduct(new ProductPromotion());
            productPromotion.setId(id);
            return productPromotionRepository.save(productPromotion);
        }
        return null;
    }

    @Override
    public Page<ProductPromotion> ProductPromotionPage(Integer page, Integer pageSize) {
        Pageable pageable = PageRequest.of(page, pageSize);
        return productPromotionRepository.findAll(pageable);
    }

    @Override
    public List<String> getIdProductAndProductDetailByIdPromotion(String idPromotion) {
        return kmProductPromotionRepository.getIdProductAndProductDetailByIdPromotion(idPromotion);
    }

    @Override
    public List<String> getIdProductDetailByIdPromotion(String idPromotion) {
        return kmProductPromotionRepository.getIdProductDetailByIdPromotion(idPromotion);
    }
}
