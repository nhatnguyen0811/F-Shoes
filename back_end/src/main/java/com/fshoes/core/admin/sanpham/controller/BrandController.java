package com.fshoes.core.admin.sanpham.controller;

import com.fshoes.core.admin.sanpham.model.request.BrandFilterRequest;
import com.fshoes.core.admin.sanpham.model.request.BrandRequest;
import com.fshoes.core.admin.sanpham.service.BrandService;
import com.fshoes.core.common.ObjectRespone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/brand")
public class BrandController {

    @Autowired
    private BrandService brandService;

    @GetMapping("/find-all")
    public ObjectRespone findAll() {
        return new ObjectRespone(brandService.findAll());
    }

    @GetMapping("/get-list")
    public ObjectRespone getListBrand() {
        return new ObjectRespone(brandService.getListBrand());
    }

    @GetMapping("")
    public ObjectRespone getBrand(BrandFilterRequest brandFilterRequest) {
        return new ObjectRespone(brandService.getBrand(brandFilterRequest));
    }

    @PostMapping("/add")
    public ObjectRespone addBrand(@RequestBody BrandRequest brandRequest) {
        return new ObjectRespone(brandService.addBrand(brandRequest));
    }

    @PutMapping("/update/{id}")
    public ObjectRespone updateBrand(@PathVariable String id, @RequestBody BrandRequest brandRequest) {
        return new ObjectRespone(brandService.updateBrand(id, brandRequest));
    }

    @DeleteMapping("/swap/{id}")
    public ObjectRespone deleteBrand(@PathVariable String id) {
        return new ObjectRespone(brandService.swapBrand(id));
    }

    @GetMapping("/get-all-name")
    public ObjectRespone getAllNameBrand() {
        return new ObjectRespone(brandService.getAllNameBrand());
    }
}
