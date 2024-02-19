package com.fshoes.core.client.controller;

import com.fshoes.core.client.model.request.ClientFindProductRequest;
import com.fshoes.core.client.model.request.ClientProductCungLoaiRequest;
import com.fshoes.core.client.model.request.ClientProductDetailRequest;
import com.fshoes.core.client.model.request.ClientProductRequest;
import com.fshoes.core.client.service.ClientProductService;
import com.fshoes.core.common.ObjectRespone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/client")
public class ClientProductController {

    @Autowired
    private ClientProductService clientProductService;

    @GetMapping("/product")
    public ObjectRespone getProduct(ClientProductRequest request) {
        return new ObjectRespone((clientProductService.getProducts(request)));
    }

    @PostMapping("/all/product")
    public ObjectRespone getAllProduct(@RequestBody ClientFindProductRequest request) {
        return new ObjectRespone((clientProductService.getAllProducts(request)));
    }

    @GetMapping("/product/{id}")
    public ObjectRespone getProductById(@PathVariable String id) {
        return new ObjectRespone((clientProductService.getProductById(id)));
    }

    @GetMapping("/product/cung-loai")
    public ObjectRespone getProductCungLoai(ClientProductCungLoaiRequest request) {
        return new ObjectRespone((clientProductService.getProductCungLoai(request)));
    }

    @GetMapping("/product-home")
    public ObjectRespone getProductHome(ClientProductRequest request) {
        return new ObjectRespone((clientProductService.getProductsHome(request)));
    }

    @GetMapping("/selling-product")
    public ObjectRespone getSellingProduct(ClientProductRequest request) {
        return new ObjectRespone((clientProductService.getSellingProduct(request)));
    }

    @GetMapping("/sale-product")
    public ObjectRespone getSaleProduct(ClientProductRequest request) {
        return new ObjectRespone((clientProductService.getSaleProduct(request)));
    }

    @GetMapping("/product/size")
    public ObjectRespone getProductBySize(ClientProductDetailRequest request) {
        return new ObjectRespone(clientProductService.getProductBySize(request));
    }

    @GetMapping("/product/color")
    public ObjectRespone getProductByColor(ClientProductDetailRequest request) {
        return new ObjectRespone(clientProductService.getProductByColor(request));
    }

    @GetMapping("/brand")
    public ObjectRespone getBrand() {
        return new ObjectRespone(clientProductService.getAllBrand());
    }

    @GetMapping("/category")
    public ObjectRespone getcategory() {
        return new ObjectRespone(clientProductService.getAllCategory());
    }

    @GetMapping("/material")
    public ObjectRespone getMaterial() {
        return new ObjectRespone(clientProductService.getAllMaterial());
    }

    @GetMapping("/sole")
    public ObjectRespone getSole() {
        return new ObjectRespone(clientProductService.getAllSole());
    }

    @GetMapping("/size")
    public ObjectRespone getSize() {
        return new ObjectRespone(clientProductService.getAllSize());
    }

    @GetMapping("/color")
    public ObjectRespone getColor() {
        return new ObjectRespone(clientProductService.getAllColor());
    }

    @GetMapping("/min-max-price")
    public ObjectRespone getMinMaxPrice() {
        return new ObjectRespone(clientProductService.getMinMaxPriceProductClient());
    }
}
