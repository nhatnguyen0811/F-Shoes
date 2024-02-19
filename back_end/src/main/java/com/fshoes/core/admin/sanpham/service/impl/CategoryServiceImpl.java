package com.fshoes.core.admin.sanpham.service.impl;

import com.fshoes.core.admin.sanpham.model.request.CategoryFilterRequest;
import com.fshoes.core.admin.sanpham.model.request.CategoryRequest;
import com.fshoes.core.admin.sanpham.model.respone.CategoryResponse;
import com.fshoes.core.admin.sanpham.repository.AdCategoryRepository;
import com.fshoes.core.admin.sanpham.service.CategoryService;
import com.fshoes.entity.Category;
import com.fshoes.infrastructure.constant.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private AdCategoryRepository categoryRepository;

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    @Override
    public List<Category> getListCategory() {
        return categoryRepository.findAllByDeleted(Status.HOAT_DONG);
    }

    @Override
    public Page<CategoryResponse> getCategory(CategoryFilterRequest categoryFilterRequest) {
        Pageable pageable = PageRequest.of(categoryFilterRequest.getPage() - 1, categoryFilterRequest.getSize());
        return categoryRepository.getCategoryByFilter(categoryFilterRequest, pageable);
    }

    @Override
    public Category addCategory(CategoryRequest categoryRequest) {
        Category category = categoryRequest.tranCategory(new Category());
        category.setDeleted(0);
        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(String id, CategoryRequest categoryRequest) {
        Optional<Category> categoryOptional = categoryRepository.findById(id);
        if (categoryOptional.isPresent()) {
            Category category = categoryRequest.tranCategory(categoryOptional.get());
            return categoryRepository.save(category);
        } else {
            return null;
        }
    }

    @Override
    public Boolean swapCategory(String id) {
        Optional<Category> categoryOptional = categoryRepository.findById(id);
        if (categoryOptional.isPresent()) {
            Category category = categoryOptional.get();
            if (category.getDeleted() == 0) {
                category.setDeleted(1);
            } else {
                category.setDeleted(0);
            }
            categoryRepository.save(category);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public List<String> getAllNameCategory() {
        return categoryRepository.getAllNameCategory();
    }
}
