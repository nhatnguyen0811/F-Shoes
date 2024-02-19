package com.fshoes.core.client.repository;

import com.fshoes.core.client.model.response.ClientPromotionResponse;
import com.fshoes.repository.PromotionRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CLientPromotionRepository extends PromotionRepository {

    @Query(value = """
                    select
                    MAX(p.value) as value,
                    pp.id_product_detail as idProductDetail,
                    pd.amount
                    from promotion p join product_promotion pp
                    on p.id = pp.id_promotion 
                    left join product_detail pd on pd.id = pp.id_product_detail
                    where pp.id_product_detail in :idProductDetail and p.status = 1
                    group by pp.id_product_detail
            """, nativeQuery = true)
    List<ClientPromotionResponse> getPromotionByProductDetail(List<String> idProductDetail);
}
