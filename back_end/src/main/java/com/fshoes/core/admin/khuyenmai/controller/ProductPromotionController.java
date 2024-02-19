package com.fshoes.core.admin.khuyenmai.controller;

import com.fshoes.core.admin.khuyenmai.model.request.ProductPromotionRequest;
import com.fshoes.core.admin.khuyenmai.service.ProductPromotionService;
import com.fshoes.core.common.ObjectRespone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/product-promotion")
public class ProductPromotionController {

    @Autowired

    private ProductPromotionService productPromotionService;


    @GetMapping("/get-all")
    public ObjectRespone getAll() {
        return new ObjectRespone(productPromotionService.getAll());
    }

    @GetMapping("/get-one/{id}")
    public ObjectRespone getOne(@PathVariable String id) {
        return new ObjectRespone(productPromotionService.getOne(id));
    }

    @PostMapping("/add")
    public ObjectRespone addProductPromotion(@RequestBody ProductPromotionRequest productPromotion) {
        return new ObjectRespone(productPromotionService.addProductPromotion(productPromotion));
    }

    @PutMapping("/update/{id}")
    public ObjectRespone updateProductPromotion(@RequestBody ProductPromotionRequest productPromotionReques, @PathVariable String id) {
        return new ObjectRespone(productPromotionService.updateProductPromotion(productPromotionReques, id));
    }

    @GetMapping("/page")
    public ObjectRespone pageProductPromotion(@RequestParam(defaultValue = "0") Integer page, @RequestParam(defaultValue = "2") Integer pageSize) {
        return new ObjectRespone(productPromotionService.ProductPromotionPage(page, pageSize));
    }

    @GetMapping("/list-product/{idPromotion}")
    public ObjectRespone getIdProductAndProductDetailByIdPromotion(@PathVariable String idPromotion) {
        return new ObjectRespone(productPromotionService.getIdProductAndProductDetailByIdPromotion(idPromotion));
    }

    @GetMapping("/list-product-detail/{idPromotion}")
    public ObjectRespone getIdProductDetailByIdPromotion(@PathVariable String idPromotion) {
        return new ObjectRespone(productPromotionService.getIdProductDetailByIdPromotion(idPromotion));
    }


}
