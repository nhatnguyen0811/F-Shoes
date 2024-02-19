package com.fshoes.core.admin.sanpham.repository;

import com.fshoes.core.admin.sanpham.model.request.ColorFilterRequest;
import com.fshoes.core.admin.sanpham.model.respone.ColorResponse;
import com.fshoes.entity.Color;
import com.fshoes.infrastructure.constant.Status;
import com.fshoes.repository.ColorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdColorRepository extends ColorRepository {
    List<Color> findAllByDeletedOrderByCreatedAtAsc(Status status);

    @Query(value = """
            SELECT id, code, name, deleted, created_at as createdAt
            FROM color
            WHERE (:#{#filter.textSearch} IS NULL OR name LIKE %:#{#filter.textSearch}%)
            AND (:#{#filter.textSearch} IS NULL OR code LIKE %:#{#filter.textSearch}%)
            ORDER BY created_at DESC
            """, nativeQuery = true)
    Page<ColorResponse> getColorByFilter(@Param("filter") ColorFilterRequest colorFilterRequest, Pageable pageable);

    @Query(value = """
            SELECT code
            FROM color
            """, nativeQuery = true)
    List<String> getAllCodeColor();

    @Query(value = """
            SELECT name
            FROM color
            """, nativeQuery = true)
    List<String> getAllNameColor();
}
