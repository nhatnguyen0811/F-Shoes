package com.fshoes.core.admin.khuyenmai.controller;


import com.fshoes.core.admin.khuyenmai.model.request.GetProductDetailByIdProduct;
import com.fshoes.core.admin.khuyenmai.model.request.ProductPromotionAddRequest;
import com.fshoes.core.admin.khuyenmai.model.request.ProductPromotionSearch;
import com.fshoes.core.admin.khuyenmai.model.request.PromotionSearch;
import com.fshoes.core.admin.khuyenmai.model.respone.PromotionRespone;
import com.fshoes.core.admin.khuyenmai.service.ProductPromotionAddService;
import com.fshoes.core.admin.khuyenmai.service.impl.PromotionServiceImpl;
import com.fshoes.core.common.ObjectRespone;
import com.fshoes.core.common.PageReponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;

@RestController
@RequestMapping("/api/admin/promotion")
public class PromotionController {

    @Autowired
    private PromotionServiceImpl khuyenMaiService;

    @Autowired

    private ProductPromotionAddService productPromotionAddService;

    @GetMapping("/get-product-detail")
    public ObjectRespone getAllProductDeatil(ProductPromotionSearch red) {
        return new ObjectRespone(productPromotionAddService.getAllProductDetail(red));
    }

    @GetMapping("/get-all")
    public ObjectRespone getAll() {
        return new ObjectRespone(khuyenMaiService.getAllPromotion());
    }

    @GetMapping("/get-product-detail-by-product/{id}")
    public ObjectRespone getAllProductDeatilByProduct(GetProductDetailByIdProduct red, @PathVariable List<String> id) {
        return new ObjectRespone(productPromotionAddService.getProductDetailByProduct(red, id));
    }

    @GetMapping("/get-product")
    public ObjectRespone getAllProduct(ProductPromotionSearch red) {
        return new ObjectRespone(productPromotionAddService.getAll(red));
    }

    @GetMapping("/get-one/{id}")
    public ObjectRespone getOne(@PathVariable String id) {
        return new ObjectRespone(khuyenMaiService.getOne(id));
    }

    @Transactional
    @PutMapping("/update/{id}")
    public ObjectRespone updateKhuyenMai(@RequestBody ProductPromotionAddRequest promotionRequest, @PathVariable String id) throws ParseException {
        return new ObjectRespone(khuyenMaiService.updateKhuyenMai(promotionRequest, id));
    }

    @Transactional
    @PutMapping("/delete/{id}")
    public ObjectRespone deleteKhuyenMai(@PathVariable String id) throws ParseException {
        return new ObjectRespone(khuyenMaiService.deleteKhuyenMai(id));
    }

    @GetMapping("/get-Promotion-filter")
    public PageReponse<PromotionRespone> getAllPro(PromotionSearch filter) {
        return new PageReponse<>(khuyenMaiService.getAllPromotion(filter));
    }

    @Transactional
    @PostMapping("/add-product-promotion")
    public ObjectRespone addProductPromotion(@RequestBody ProductPromotionAddRequest request) throws ParseException {
        return new ObjectRespone(khuyenMaiService.addKhuyenMaiOnProduct(request));
    }

    @PostMapping("/export-excel")
    public ObjectRespone exportExcel() throws IOException {
        return new ObjectRespone(khuyenMaiService.exportExcel());
    }


}
