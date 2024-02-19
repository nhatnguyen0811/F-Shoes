package com.fshoes.core.admin.sanpham.controller;

import com.fshoes.core.admin.sanpham.model.request.MaterialFilterRequest;
import com.fshoes.core.admin.sanpham.model.request.MaterialRequest;
import com.fshoes.core.admin.sanpham.service.MaterialService;
import com.fshoes.core.common.ObjectRespone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/material")
public class MaterialController {

    @Autowired
    private MaterialService materialService;

    @GetMapping("/find-all")
    public ObjectRespone findAll() {
        return new ObjectRespone(materialService.findAll());
    }

    @GetMapping("/get-list")
    public ObjectRespone getListMaterial() {
        return new ObjectRespone(materialService.getListMaterial());
    }

    @GetMapping("")
    public ObjectRespone getMaterial(MaterialFilterRequest materialFilterRequest) {
        return new ObjectRespone(materialService.getMaterial(materialFilterRequest));
    }

    @PostMapping("/add")
    public ObjectRespone addMaterial(@RequestBody MaterialRequest materialRequest) {
        return new ObjectRespone(materialService.addMaterial(materialRequest));
    }

    @PutMapping("/update/{id}")
    public ObjectRespone updateMaterial(@PathVariable String id, @RequestBody MaterialRequest materialRequest) {
        return new ObjectRespone(materialService.updateMaterial(id, materialRequest));
    }

    @DeleteMapping("/swap/{id}")
    public ObjectRespone deleteMaterial(@PathVariable String id) {
        return new ObjectRespone(materialService.swapMaterial(id));
    }

    @GetMapping("/get-all-name")
    public ObjectRespone getAllNameMaterial() {
        return new ObjectRespone(materialService.getAllNameMaterial());
    }

}
