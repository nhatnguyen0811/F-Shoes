package com.fshoes.core.admin.sanpham.repository;

import com.fshoes.core.admin.sanpham.model.request.BrandFilterRequest;
import com.fshoes.core.admin.sanpham.model.respone.BrandResponse;
import com.fshoes.entity.Brand;
import com.fshoes.infrastructure.constant.Status;
import com.fshoes.repository.BrandRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdBrandRepository extends BrandRepository {
    List<Brand> findAllByDeleted(Status status);

    @Query(value = """
            SELECT ROW_NUMBER() over (ORDER BY updated_at desc ) as stt, id, name, deleted, created_at as createdAt
            FROM brand
            WHERE (:#{#filter.name} IS NULL OR name LIKE %:#{#filter.name}%)
            ORDER BY created_at DESC
            """, nativeQuery = true)
    Page<BrandResponse> getBrandByFilter(@Param("filter") BrandFilterRequest brandFilterRequest, Pageable pageable);

    @Query(value = """
            SELECT name
            FROM brand
            """, nativeQuery = true)
    List<String> getAllNameBrand();
}
