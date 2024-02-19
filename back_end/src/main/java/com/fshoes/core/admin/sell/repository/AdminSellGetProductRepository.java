package com.fshoes.core.admin.sell.repository;

import com.fshoes.core.admin.sell.model.request.FilterProductDetailRequest;
import com.fshoes.core.admin.sell.model.response.AdminMinMaxPrice;
import com.fshoes.core.admin.sell.model.response.GetAllProductResponse;
import com.fshoes.repository.ProductRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminSellGetProductRepository extends ProductRepository {

//    @Query(value = """
//                SELECT  p.id, MAX(pr.value) AS value, p.name,
//                 pd.price,pd.weight, s.size, MAX(i.url) as url,
//                 pd.amount,pd.id as productDetailId,
//                 m.name as material, sl.name as sole,b.name as brand,c.name as color ,
//                 pd.code , cate.name as category
//             	FROM product p left join product_detail pd
//                   on p.id = pd.id_product  join size s
//                    on s.id = pd.id_size
//                     join material m on m.id = pd.id_material
//                     join category cate on cate.id = pd.id_category
//                     join sole sl on sl.id = pd.id_sole
//                      join brand b on b.id  = pd.id_brand
//                    join color c on c.id = pd.id_color
//                     left join image i on i.id_product_detail = pd.id
//                      left join product_promotion pp on pd.id = pp.id_product_detail
//                      left join promotion pr on pr.id = pp.id_promotion and pr.status = 1
//                       where (:#{#req.category} IS NULL OR cate.id = :#{#req.category})
//                       AND (:#{#req.color} IS NULL OR c.id = :#{#req.color})
//                        AND (:#{#req.material} IS NULL OR m.id = :#{#req.material})
//                        AND (:#{#req.size} IS NULL OR s.id = :#{#req.size})
//                        AND (:#{#req.brand} IS NULL OR b.id = :#{#req.brand})
//                         AND (:#{#req.sole} IS NULL OR sl.id = :#{#req.sole})
//                         AND (:#{#req.minPrice} IS NULL OR pd.price >= :#{#req.minPrice})
//                         AND (:#{#req.maxPrice} IS NULL OR pd.price <= :#{#req.maxPrice})
//                         AND (:#{#req.codeProductDetail} IS NULL OR pd.code = :#{#req.codeProductDetail})
//                         AND (:#{#req.nameProductDetail} IS NULL OR p.name like %:#{#req.nameProductDetail}%)
//                         AND p.deleted = 0 AND pd.deleted = 0
//                          group by p.id, pr.id, pd.id;
//            """, nativeQuery = true)
//    List<GetAllProductResponse> getAllProduct(@Param("req") FilterProductDetailRequest req);

    @Query(value = """
                                                SELECT  p.id, pr.id as promotion,pr.status as statusPromotion ,pr.value, p.name,
                                                pd.price,pd.weight, s.size, MAX(i.url) as url, 
                                                pd.amount,pd.id as productDetailId,
                                                m.name as material, sl.name as sole,b.name as brand,c.name as color ,
                                                pd.code , cate.name as category
             									FROM product p left join product_detail pd
                                                  on p.id = pd.id_product left join size s
                                                  on s.id = pd.id_size
                                                  left join material m on m.id = pd.id_material
                                                  left join category cate on cate.id = pd.id_category
                                                  left join sole sl on sl.id = pd.id_sole
                                                  left join brand b on b.id  = pd.id_brand
                                                  left join color c on c.id = pd.id_color
                                                  left join image i on i.id_product_detail = pd.id
                                                  left join product_promotion pp on pd.id = pp.id_product_detail
                                                  left join promotion pr on pr.id = pp.id_promotion
                                                  where pd.id = :id
                                                  group by p.id, pr.id, pd.id;
            """, nativeQuery = true)
    GetAllProductResponse realTimeProductModalAddAdmin(String id);

    @Query(value = """
                                                SELECT  p.id, pr.id as promotion,pr.status as statusPromotion ,pr.value, p.name,
                                                pd.price,pd.weight, s.size, MAX(i.url) as url, 
                                                pd.amount,pd.id as productDetailId,
                                                m.name as material, sl.name as sole,b.name as brand,c.name as color ,
                                                pd.code , cate.name as category
             									FROM product p left join product_detail pd
                                                  on p.id = pd.id_product left join size s
                                                  on s.id = pd.id_size
                                                  left join material m on m.id = pd.id_material
                                                  left join category cate on cate.id = pd.id_category
                                                  left join sole sl on sl.id = pd.id_sole
                                                  left join brand b on b.id  = pd.id_brand
                                                  left join color c on c.id = pd.id_color
                                                  left join image i on i.id_product_detail = pd.id
                                                  left join product_promotion pp on pd.id = pp.id_product_detail
                                                  left join promotion pr on pr.id = pp.id_promotion
                                                  where pd.id = :id 
                                                  AND p.deleted = 0
                                                  group by p.id, pr.id, pd.id;
            """, nativeQuery = true)
    GetAllProductResponse getProduct(String id);

    @Query(value = """
             		SELECT p.id, pr.id as promotion,pr.value, p.name, pd.price, s.size, i.url, pd.amount
             									FROM product p inner join product_detail pd
                                                  on p.id = pd.id_product inner join size s
                                                  on s.id = pd.id_size
                                                  inner join image i on i.id_product_detail = pd.id
                                                  inner join product_promotion pp on pd.id = pp.id_product_detail
                                                  inner join promotion pr on pr.id = pp.id_promotion
                                                  
            """, nativeQuery = true)
    List<GetAllProductResponse> getAllProductCart();


    @Query(value = """
            SELECT min(pd.price) as minPrice, max(pd.price) as maxPrice
            FROM product_detail pd
            """, nativeQuery = true)
    AdminMinMaxPrice getMinMaxPriceProductAdmin();

}
