package com.fshoes.core.common;

import com.fshoes.entity.ProductDetail;
import com.fshoes.infrastructure.constant.Status;
import com.fshoes.repository.ProductDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/check-start")
public class CheckStartController {
    @Autowired
    private ProductDetailRepository productDetailRepository;

    @GetMapping
    public ObjectRespone checkStart() {
        return new ObjectRespone(true);
    }

    @GetMapping("/check-quantity")
    public Boolean checkQuantity(@RequestParam String id, @RequestParam Integer quantity) {
        ProductDetail productDetail = productDetailRepository.checkQuantity(id, quantity, Status.HOAT_DONG).orElse(null);
        return productDetail != null;
    }


}
