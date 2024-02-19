package com.fshoes.core.client.controller;

import com.fshoes.core.client.model.request.ClientAddCartRequest;
import com.fshoes.core.client.service.ClientCartService;
import com.fshoes.core.common.ObjectRespone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/client/cart")
public class ClientCartController {
    @Autowired
    private ClientCartService cartService;

    @GetMapping
    public ObjectRespone getCart() {
        return new ObjectRespone(cartService.getCart());
    }

    @PostMapping("/add")
    public ObjectRespone addCart(@RequestBody ClientAddCartRequest request) {
        return new ObjectRespone(cartService.addCart(request));
    }

    @PostMapping("/set")
    public ObjectRespone setCart(@RequestBody List<ClientAddCartRequest> request) {
        return new ObjectRespone(cartService.setCart(request));
    }

    @GetMapping("/get-promotion-by-product-detail/{idProductDetail}")
    public ObjectRespone getPromotionByProductDetail(@PathVariable("idProductDetail") List<String> idProductDetail) {
        return new ObjectRespone(cartService.getPromotionByProductDetail(idProductDetail));
    }
}
