package com.fshoes.core.admin.khuyenmai.repository;

import com.fshoes.repository.ProductPromotionRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KMProductPromotionRepository extends ProductPromotionRepository {

    @Query(value = """
             SELECT p.id FROM product_promotion pp inner join product_detail pd
                on pd.id = pp.id_product_detail inner join product p
                on p.id = pd.id_product where pp.id_promotion = :idPromotion
            """, nativeQuery = true)
    List<String> getIdProductAndProductDetailByIdPromotion(String idPromotion);

    @Query(value = """
             SELECT pd.id as productDetail FROM product_promotion pp inner join product_detail pd
                on pd.id = pp.id_product_detail inner join product p
                on p.id = pd.id_product where pp.id_promotion = :idPromotion
            """, nativeQuery = true)
    List<String> getIdProductDetailByIdPromotion(String idPromotion);
}
