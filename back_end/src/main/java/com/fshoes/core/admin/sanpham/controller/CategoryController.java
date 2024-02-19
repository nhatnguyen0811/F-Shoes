package com.fshoes.core.admin.sanpham.controller;

import com.fshoes.core.admin.sanpham.model.request.CategoryFilterRequest;
import com.fshoes.core.admin.sanpham.model.request.CategoryRequest;
import com.fshoes.core.admin.sanpham.service.CategoryService;
import com.fshoes.core.common.ObjectRespone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/find-all")
    public ObjectRespone findAll() {
        return new ObjectRespone(categoryService.findAll());
    }

    @GetMapping("get-list")
    public ObjectRespone getListCategory() {
        return new ObjectRespone(categoryService.getListCategory());
    }

    @GetMapping("")
    public ObjectRespone getCategory(CategoryFilterRequest categoryFilterRequest) {
        return new ObjectRespone(categoryService.getCategory(categoryFilterRequest));
    }

    @PostMapping("/add")
    public ObjectRespone addCategory(@RequestBody CategoryRequest categoryRequest) {
        return new ObjectRespone(categoryService.addCategory(categoryRequest));
    }

    @PutMapping("/update/{id}")
    public ObjectRespone updateCategory(@PathVariable String id, @RequestBody CategoryRequest categoryRequest) {
        return new ObjectRespone(categoryService.updateCategory(id, categoryRequest));
    }

    @DeleteMapping("/swap/{id}")
    public ObjectRespone deleteCategory(@PathVariable String id) {
        return new ObjectRespone(categoryService.swapCategory(id));
    }

    @GetMapping("/get-all-name")
    public ObjectRespone getAllNameCategory() {
        return new ObjectRespone(categoryService.getAllNameCategory());
    }
}
