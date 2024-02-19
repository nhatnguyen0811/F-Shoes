package com.fshoes.core.admin.sell.repository;

import com.fshoes.core.admin.sanpham.model.respone.ProductMaxPriceResponse;
import com.fshoes.core.admin.sell.model.request.FilterProductDetailRequest;
import com.fshoes.core.admin.sell.model.response.GetAllProductResponse;
import com.fshoes.core.admin.sell.model.response.GetAmountProductResponse;
import com.fshoes.core.admin.sell.model.response.GetColorResponse;
import com.fshoes.core.admin.sell.model.response.GetProductDetailBillSellResponse;
import com.fshoes.core.admin.sell.model.response.GetSizeResponse;
import com.fshoes.repository.ProductDetailRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminProductDetailRepository extends ProductDetailRepository {
    @Query(value = """
                      SELECT 
                MAX(pr.value) as value,
                      CONCAT(p.name, ' ', m.name, ' ', so.name) as nameProduct,
                      bd.id as idBillDetail,
                         s.size,
                         pd.id as id,
                         MAX(i.url) as image ,
                       MAX(pd.price) as price,
                       MAX(pd.weight) as weight,
                       MAX(bd.quantity) as quantity,
                       pd.id_product,
                       pd.id_size  
                   FROM product_detail pd 
                   left join bill_detail bd on bd.id_product_detail = pd.id 
                   left join bill b on b.id = bd.id_bill 
                   left join product p on p.id = pd.id_product 
                   left join material m on m.id = pd.id_material 
                   left join sole so on so.id = pd.id_sole
                   left join size s on s.id = pd.id_size
                   left join image i on i.id_product_detail = pd.id 
                   left join product_promotion pp on pp.id_product_detail = pd.id
                  left join promotion pr on pr.id = pp.id_promotion and pr.status = 1
                  where b.id = :id 
                   GROUP BY pd.id,  pd.id_product, pd.id_size,bd.id
                   
            """, nativeQuery = true)
    List<GetProductDetailBillSellResponse> getlistProductBilllSell(String id);

    @Query(value = """
                  SELECT s.id, s.size FROM product_detail pd join size s on s.id = pd.id_size group by s.size, s.id ;
            """, nativeQuery = true)
    List<GetSizeResponse> getlistSize();

    @Query(value = """
                 SELECT c.id , c.name as nameColor FROM product_detail pd join color c on c.id = pd.id_color group by c.name, c.id
            """, nativeQuery = true)
    List<GetColorResponse> getlistColor();


    @Query(value = """   
                 SELECT MAX(pd.id) as productDetailId,
                MAX(pr.value) as value,
                      (p.name) as nameProduct,
                       cate.name as category,
                       b.name as brand,
                        m.name as material,
                         s.name as sole,        
                         c.name as color ,
                         si.size,
                         pd.id as productDetailId,
                       MAX(pd.price) as price,
                       MAX(pd.weight) as weight,
                       MAX(pd.amount) as amount,
                       pd.id_product,
                       pd.id_color,
                       pd.id_material,
                       pd.id_sole,
                       pd.id_category,
                       pd.id_brand,
                       pd.id_size
                FROM product_detail pd
                         JOIN
                     product p ON p.id = pd.id_product
                         JOIN
                     color c ON c.id = pd.id_color
                         JOIN
                     category cate ON cate.id = pd.id_category
                         JOIN
                     brand b ON b.id = pd.id_brand
                         JOIN
                     sole s ON s.id = pd.id_sole
                         JOIN
                     material m ON m.id = pd.id_material
                      JOIN
                     size si ON si.id = pd.id_size
                         LEFT JOIN
                     image i ON pd.id = i.id_product_detail
                     LEFT JOIN product_promotion pp ON pd.id = pp.id_product_detail
                         LEFT JOIN promotion pr ON pr.id = pp.id_promotion and pr.status =1
                                                  where pd.id = :id
                                                     GROUP BY pd.id, pd.code, pd.id_product, pd.id_color, pd.id_material, pd.id_sole, pd.id_category, pd.id_brand, pd.id_size
            """, nativeQuery = true)
    GetAmountProductResponse getAmount(String id);

    @Query(value = """
            SELECT p.id, MAX(pd.price) AS price, p.name as name
            FROM product p
            JOIN product_detail pd ON p.id = pd.id_product
            GROUP BY p.id
            ORDER BY price DESC;
            """, nativeQuery = true)
    List<ProductMaxPriceResponse> getProductMaxPrice();

    @Query(value = """
                SELECT MAX(pd.id) as id,
                MAX(pr.value) as value,
                pr.status as statusPromotion,
                       p.name,
                       pd.code,
                       cate.name as category,
                       b.name as brand,
                        m.name as material,
                         s.name as sole,        
                         c.name as color ,
                         si.size,
                         pd.id as productDetailId,
                       MAX(pd.price) as price,
                       MAX(pd.weight) as weight,
                       MAX(pd.amount) as amount,
                       max( i.url) as url,
                       pd.id_product,
                       pd.id_color,
                       pd.id_material,
                       pd.id_sole,
                       pd.id_category,
                       pd.id_brand,
                       pd.id_size
                FROM product_detail pd
                         JOIN
                     product p ON p.id = pd.id_product
                         JOIN
                     color c ON c.id = pd.id_color
                         JOIN
                     category cate ON cate.id = pd.id_category
                         JOIN
                     brand b ON b.id = pd.id_brand
                         JOIN
                     sole s ON s.id = pd.id_sole
                         JOIN
                     material m ON m.id = pd.id_material
                      JOIN
                     size si ON si.id = pd.id_size
                         LEFT JOIN
                     image i ON pd.id = i.id_product_detail
                     LEFT JOIN product_promotion pp ON pd.id = pp.id_product_detail
                         LEFT JOIN promotion pr ON pr.id = pp.id_promotion and pr.status =1
                       where (:#{#req.category} IS NULL OR cate.id = :#{#req.category}) 
                       AND (:#{#req.color} IS NULL OR c.id = :#{#req.color}) 
                        AND (:#{#req.material} IS NULL OR m.id = :#{#req.material}) 
                        AND (:#{#req.size} IS NULL OR si.id = :#{#req.size}) 
                        AND (:#{#req.brand} IS NULL OR b.id = :#{#req.brand}) 
                         AND (:#{#req.sole} IS NULL OR s.id = :#{#req.sole}) 
                         AND (:#{#req.minPrice} IS NULL OR pd.price >= :#{#req.minPrice}) 
                         AND (:#{#req.maxPrice} IS NULL OR pd.price <= :#{#req.maxPrice}) 
                         AND ( (:#{#req.nameProductDetail} IS NULL OR p.name like %:#{#req.nameProductDetail}%) 
                          or (:#{#req.nameProductDetail} IS NULL OR pd.code like %:#{#req.nameProductDetail}%) 
                OR (:#{#req.nameProductDetail} IS NULL OR cate.name like %:#{#req.nameProductDetail}%) 
                OR (:#{#req.nameProductDetail} IS NULL OR c.name like %:#{#req.nameProductDetail}%) 
                OR (:#{#req.nameProductDetail} IS NULL OR m.name like %:#{#req.nameProductDetail}%) 
                OR (:#{#req.nameProductDetail} IS NULL OR si.size like %:#{#req.nameProductDetail}%) 
                OR (:#{#req.nameProductDetail} IS NULL OR b.name like %:#{#req.nameProductDetail}%)
                OR (:#{#req.nameProductDetail} IS NULL OR s.name like %:#{#req.nameProductDetail}%)) 
                         AND p.deleted = 0 AND pd.deleted = 0 AND pd.amount > 0
                              GROUP BY pd.id, pr.status, pd.code, pd.id_product, pd.id_color, pd.id_material, pd.id_sole, pd.id_category, pd.id_brand, pd.id_size
            """, nativeQuery = true)
    List<GetAllProductResponse> getAllProduct(@Param("req") FilterProductDetailRequest req);
}
