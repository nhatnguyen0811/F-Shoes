package com.fshoes.core.admin.sanpham.repository;

import com.fshoes.core.admin.sanpham.model.request.MaterialFilterRequest;
import com.fshoes.core.admin.sanpham.model.respone.MaterialResponse;
import com.fshoes.entity.Material;
import com.fshoes.infrastructure.constant.Status;
import com.fshoes.repository.MaterialRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdMaterialRepository extends MaterialRepository {
    List<Material> findAllByDeleted(Status status);

    @Query(value = """
            SELECT ROW_NUMBER() over (ORDER BY updated_at desc ) as stt, id, name, deleted, created_at as createdAt
            FROM material
            WHERE (:#{#filter.name} IS NULL OR name LIKE %:#{#filter.name}%)
            ORDER BY created_at DESC
            """, nativeQuery = true)
    Page<MaterialResponse> getMaterialByFilter(@Param("filter") MaterialFilterRequest materialFilterRequest, Pageable pageable);

    @Query(value = """
            SELECT name
            FROM material
            """, nativeQuery = true)
    List<String> getAllNameMaterial();
}
