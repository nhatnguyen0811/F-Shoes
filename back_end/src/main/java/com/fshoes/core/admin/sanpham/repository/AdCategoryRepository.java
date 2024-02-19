package com.fshoes.core.admin.sanpham.repository;

import com.fshoes.core.admin.sanpham.model.request.CategoryFilterRequest;
import com.fshoes.core.admin.sanpham.model.respone.CategoryResponse;
import com.fshoes.entity.Category;
import com.fshoes.infrastructure.constant.Status;
import com.fshoes.repository.CategoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdCategoryRepository extends CategoryRepository {
    List<Category> findAllByDeleted(Status status);

    @Query(value = """
            SELECT ROW_NUMBER() over (ORDER BY updated_at desc ) as stt, id, name, deleted, created_at as createdAt
            FROM category
            WHERE (:#{#filter.name} IS NULL OR name LIKE %:#{#filter.name}%)
            ORDER BY created_at DESC
            """, nativeQuery = true)
    Page<CategoryResponse> getCategoryByFilter(@Param("filter") CategoryFilterRequest categoryFilterRequest, Pageable pageable);

    @Query(value = """
            SELECT name
            FROM category
            """, nativeQuery = true)
    List<String> getAllNameCategory();
}
