package com.fshoes.repository;

import com.fshoes.entity.ProductPromotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductPromotionRepository extends JpaRepository<ProductPromotion, String> {
    @Query(value = """
            select *
            from product_promotion
            where id_promotion = :idPromotion
            """, nativeQuery = true)
    List<ProductPromotion> getListProductPromotionByIdPromotion(String idPromotion);
}
