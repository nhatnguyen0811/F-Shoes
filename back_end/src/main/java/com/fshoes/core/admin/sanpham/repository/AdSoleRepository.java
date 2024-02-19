package com.fshoes.core.admin.sanpham.repository;

import com.fshoes.core.admin.sanpham.model.request.SoleFilterRequest;
import com.fshoes.core.admin.sanpham.model.respone.SoleResponse;
import com.fshoes.entity.Sole;
import com.fshoes.infrastructure.constant.Status;
import com.fshoes.repository.SoleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdSoleRepository extends SoleRepository {
    List<Sole> findAllByDeleted(Status status);

    @Query(value = """
            SELECT ROW_NUMBER() over (ORDER BY updated_at desc ) as stt, id, name, deleted, created_at as createdAt
            FROM sole
            WHERE (:#{#filter.name} IS NULL OR name LIKE %:#{#filter.name}%)
            ORDER BY created_at DESC
            """, nativeQuery = true)
    Page<SoleResponse> getSoleByFilter(@Param("filter") SoleFilterRequest soleFilterRequest, Pageable pageable);

    @Query(value = """
            SELECT name
            FROM sole
            """, nativeQuery = true)
    List<String> getAllNameSole();

    Sole findByName(String name);
}
