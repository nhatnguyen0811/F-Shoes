package com.fshoes.core.admin.hoadon.repository;

import com.fshoes.core.admin.hoadon.model.respone.HDProductDetailResponse;
import com.fshoes.repository.ProductDetailRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface HDProductDetailRepository extends ProductDetailRepository {
    @Query(value = """
            SELECT pd.id, p.value as value, pd.price as price
            FROM product_detail pd
            INNER  JOIN product_promotion pp on pd.id = pp.id_product_detail
            INNER  JOIN promotion p on pp.id_promotion = p.id
            WHERE p.status = 1 AND pd.id = :id
            ORDER BY p.value DESC
            LIMIT 1
            """, nativeQuery = true)
    HDProductDetailResponse getPrdVsKM(@Param("id") String id);

}
