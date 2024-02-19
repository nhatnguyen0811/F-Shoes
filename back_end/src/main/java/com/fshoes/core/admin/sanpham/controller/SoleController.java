package com.fshoes.core.admin.sanpham.controller;

import com.fshoes.core.admin.sanpham.model.request.SoleFilterRequest;
import com.fshoes.core.admin.sanpham.model.request.SoleRequest;
import com.fshoes.core.admin.sanpham.service.SoleService;
import com.fshoes.core.common.ObjectRespone;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/sole")
public class SoleController {

    @Autowired
    private SoleService soleService;

    @GetMapping("/find-all")
    public ObjectRespone findAll() {
        return new ObjectRespone(soleService.findAll());
    }

    @GetMapping("/get-list")
    public ObjectRespone getListSole() {
        return new ObjectRespone(soleService.getListSole());
    }

    @GetMapping("")
    public ObjectRespone getSole(SoleFilterRequest soleFilterRequest) {
        return new ObjectRespone(soleService.getSole(soleFilterRequest));
    }

    @PostMapping("/add")
    public ObjectRespone addSole(@Valid @RequestBody SoleRequest soleRequest) {
        return new ObjectRespone(soleService.addSole(soleRequest));
    }

    @PutMapping("/update/{id}")
    public ObjectRespone updateSole(@PathVariable String id, @RequestBody SoleRequest soleRequest) {
        return new ObjectRespone(soleService.updateSole(id, soleRequest));
    }

    @DeleteMapping("/swap/{id}")
    public ObjectRespone deleteSole(@PathVariable String id) {
        return new ObjectRespone(soleService.swapSole(id));
    }

    @GetMapping("/get-all-name")
    public ObjectRespone getAllNameSole() {
        return new ObjectRespone(soleService.getAllNameSole());
    }
}
