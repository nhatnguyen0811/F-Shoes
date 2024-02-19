package com.fshoes.core.admin.sanpham.service;

import com.fshoes.core.admin.sanpham.model.request.CategoryFilterRequest;
import com.fshoes.core.admin.sanpham.model.request.CategoryRequest;
import com.fshoes.core.admin.sanpham.model.respone.CategoryResponse;
import com.fshoes.entity.Category;
import org.springframework.data.domain.Page;

import java.util.List;

public interface CategoryService {
    List<Category> findAll();

    List<Category> getListCategory();

    Page<CategoryResponse> getCategory(CategoryFilterRequest categoryFilterRequest);

    Category addCategory(CategoryRequest categoryRequest);

    Category updateCategory(String id, CategoryRequest categoryRequest);

    Boolean swapCategory(String id);

    List<String> getAllNameCategory();
}
