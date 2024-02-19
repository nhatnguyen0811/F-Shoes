package com.fshoes.core.admin.sanpham.repository;

import com.fshoes.core.admin.sanpham.model.request.SizeFilterRequest;
import com.fshoes.core.admin.sanpham.model.respone.SizeResponse;
import com.fshoes.entity.Size;
import com.fshoes.infrastructure.constant.Status;
import com.fshoes.repository.SizeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdSizeRepository extends SizeRepository {
    List<Size> findAllByDeletedOrderBySizeAsc(Status status);

    @Query(value = """
            SELECT id, size, deleted, created_at as createdAt
            FROM size
            WHERE (:#{#filter.size} IS NULL OR size LIKE %:#{#filter.size}%)
            ORDER BY created_at DESC
            """, nativeQuery = true)
    Page<SizeResponse> getSizeByFilter(@Param("filter") SizeFilterRequest sizeFilterRequest, Pageable pageable);

    @Query(value = """
            SELECT size
            FROM size
            """, nativeQuery = true)
    List<Integer> getAllNameSize();
}
