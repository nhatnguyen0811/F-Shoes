package com.fshoes.core.admin.sanpham.controller;

import com.fshoes.core.admin.sanpham.model.request.ColorFilterRequest;
import com.fshoes.core.admin.sanpham.model.request.ColorRequest;
import com.fshoes.core.admin.sanpham.service.ColorService;
import com.fshoes.core.common.ObjectRespone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/color")
public class ColorController {

    @Autowired
    private ColorService colorService;

    @GetMapping("/find-all")
    public ObjectRespone findAll() {
        return new ObjectRespone(colorService.findAll());
    }

    @GetMapping("/get-list")
    public ObjectRespone getListColor() {
        return new ObjectRespone(colorService.getListColor());
    }

    @GetMapping("")
    public ObjectRespone getColor(ColorFilterRequest colorFilterRequest) {
        return new ObjectRespone(colorService.getColor(colorFilterRequest));
    }

    @PostMapping("/add")
    public ObjectRespone addColor(@RequestBody ColorRequest colorRequest) {
        return new ObjectRespone(colorService.addColor(colorRequest));
    }

    @PutMapping("/update/{id}")
    public ObjectRespone updateColor(@PathVariable String id, @RequestBody ColorRequest colorRequest) {
        return new ObjectRespone(colorService.updateColor(id, colorRequest));
    }

    @DeleteMapping("/swap/{id}")
    public ObjectRespone deleteColor(@PathVariable String id) {
        return new ObjectRespone(colorService.swapColor(id));
    }

    @GetMapping("/get-all-code")
    public ObjectRespone getAllCodeColor() {
        return new ObjectRespone(colorService.getAllCodeColor());
    }

    @GetMapping("/get-all-name")
    public ObjectRespone getAllNameColor() {
        return new ObjectRespone(colorService.getAllNameColor());
    }
}
