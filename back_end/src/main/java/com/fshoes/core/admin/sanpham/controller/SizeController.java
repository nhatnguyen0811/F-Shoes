package com.fshoes.core.admin.sanpham.controller;

import com.fshoes.core.admin.sanpham.model.request.SizeFilterRequest;
import com.fshoes.core.admin.sanpham.model.request.SizeRequest;
import com.fshoes.core.admin.sanpham.service.SizeService;
import com.fshoes.core.common.ObjectRespone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/size")
public class SizeController {

    @Autowired
    private SizeService sizeService;

    @GetMapping("/find-all")
    public ObjectRespone findAll() {
        return new ObjectRespone(sizeService.findAll());
    }

    @GetMapping("/get-list")
    public ObjectRespone getListSize() {
        return new ObjectRespone(sizeService.getListSize());
    }

    @GetMapping("")
    public ObjectRespone getSize(SizeFilterRequest sizeFilterRequest) {
        return new ObjectRespone(sizeService.getSize(sizeFilterRequest));
    }

    @PostMapping("/add")
    public ObjectRespone addSize(@RequestBody SizeRequest sizeRequest) {
        return new ObjectRespone(sizeService.addSize(sizeRequest));
    }

    @PutMapping("/update/{id}")
    public ObjectRespone updateSize(@PathVariable String id, @RequestBody SizeRequest sizeRequest) {
        return new ObjectRespone(sizeService.updateSize(id, sizeRequest));
    }

    @DeleteMapping("/swap/{id}")
    public ObjectRespone deleteSize(@PathVariable String id) {
        return new ObjectRespone(sizeService.swapSize(id));
    }

    @GetMapping("/get-all-name")
    public ObjectRespone getAllNameSize() {
        return new ObjectRespone(sizeService.getAllNameSize());
    }
}
