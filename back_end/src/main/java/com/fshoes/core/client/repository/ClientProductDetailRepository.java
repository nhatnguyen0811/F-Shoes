package com.fshoes.core.client.repository;

import com.fshoes.core.client.model.request.ClientFindProductRequest;
import com.fshoes.core.client.model.request.ClientProductCungLoaiRequest;
import com.fshoes.core.client.model.request.ClientProductDetailRequest;
import com.fshoes.core.client.model.request.ClientProductRequest;
import com.fshoes.core.client.model.response.ClientMinMaxPrice;
import com.fshoes.core.client.model.response.ClientProductDetailResponse;
import com.fshoes.core.client.model.response.ClientProductResponse;
import com.fshoes.repository.ProductDetailRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientProductDetailRepository extends ProductDetailRepository {
    @Query(value = """
                SELECT MAX(pd.id) as id,
                MAX( pr.id) as promotion ,
                MAX( pr.status) as statusPromotion ,
                MAX(pr.value) as value,
                       CONCAT(p.name, ' ', m.name, ' ', s.name, ' "', c.name,'"') AS name,
                       ca.name as nameCate,
                       b.name as nameBrand,
                       MAX(pd.price) as price,
                       MAX(pd.weight) as weight,
                       MAX(pd.amount) as amount,
                       MAX(pd.description) as description,
                       GROUP_CONCAT(DISTINCT i.url) as image,
                       pd.id_product,
                       pd.id_color,
                       pd.id_material,
                       pd.id_sole,
                       pd.id_category,
                       pd.id_brand
                FROM product_detail pd
                         JOIN
                     product p ON p.id = pd.id_product
                         JOIN
                     color c ON c.id = pd.id_color
                         JOIN
                     category ca ON ca.id = pd.id_category
                         JOIN
                     brand b ON b.id = pd.id_brand
                         JOIN
                     sole s ON s.id = pd.id_sole
                         JOIN
                     material m ON m.id = pd.id_material
                         LEFT JOIN
                     image i ON pd.id = i.id_product_detail
                     LEFT JOIN product_promotion pp ON pd.id = pp.id_product_detail
                         LEFT JOIN promotion pr ON pr.id = pp.id_promotion
                WHERE p.deleted = 0 AND pd.deleted = 0 AND pd.amount > 0 AND (:#{#request.id} is null or pd.id = :#{#request.id})
                AND (:#{#request.category} IS NULL OR ca.id IN (:#{#request.category}))
                AND (:#{#request.color} IS NULL  OR c.id IN (:#{#request.color}))
                AND (:#{#request.material} IS NULL  OR m.id IN (:#{#request.material}))
                AND (:#{#request.brand} IS NULL OR b.id IN (:#{#request.brand}))
                AND (:#{#request.sole} IS NULL OR s.id IN (:#{#request.sole}))
                AND( (:#{#request.nameProductDetail} IS NULL OR p.name like %:#{#request.nameProductDetail}%)
                OR (:#{#request.nameProductDetail} IS NULL OR ca.name like %:#{#request.nameProductDetail}%)
                OR (:#{#request.nameProductDetail} IS NULL OR c.name like %:#{#request.nameProductDetail}%)
                OR (:#{#request.nameProductDetail} IS NULL OR s.name like %:#{#request.nameProductDetail}%)
                OR (:#{#request.nameProductDetail} IS NULL OR m.name like %:#{#request.nameProductDetail}%))
                GROUP BY pd.id_product, pd.id_color, pd.id_material, pd.id_sole, pd.id_category, pd.id_brand
            """, nativeQuery = true)
    List<ClientProductResponse> getProducts(@Param("request") ClientProductRequest request);

    @Query(value = """
                SELECT
                    pd.id as id,
                    MAX(pr.value) as value,
                    CONCAT(p.name, ' ', m.name, ' ', s.name) AS name,
                    ca.name as nameCate,
                    b.name as nameBrand,
                    c.code as codeColor,
                    c.name as nameColor,
                    si.size as size,
                    pd.price as price,
                    pd.weight as weight,
                    pd.amount as amount,
                    pd.description as description,
                    GROUP_CONCAT(DISTINCT i.url) as image,
                    pd.id_product,
                    pd.id_color,
                    pd.id_material,
                    pd.id_sole,
                    pd.id_category,
                    pd.id_brand
                FROM product_detail pd
                        LEFT JOIN product_promotion pp on pp.id_product_detail = pd.id
                        LEFT JOIN promotion pr on pr.id = pp.id_promotion and pr.status = 1
                         JOIN
                     product p ON p.id = pd.id_product
                         JOIN
                     size si ON si.id = pd.id_size
                         JOIN
                     color c ON c.id = pd.id_color
                         JOIN
                     category ca ON ca.id = pd.id_category
                         JOIN
                     brand b ON b.id = pd.id_brand
                         JOIN
                     sole s ON s.id = pd.id_sole
                         JOIN
                     material m ON m.id = pd.id_material
                         LEFT JOIN
                     image i ON pd.id = i.id_product_detail
                WHERE p.deleted = 0 AND pd.deleted = 0 AND pd.amount > 0
                AND (:#{#request.id} is null or pd.id = :#{#request.id})
                AND (:#{#request.minPrice} IS NULl OR pd.price >= :#{#request.minPrice})
                AND (:#{#request.maxPrice} IS NULl OR pd.price <= :#{#request.maxPrice})
                AND (:#{#request.category.size()} < 1 OR ca.id IN (:#{#request.category})) 
                AND (:#{#request.color.size()} < 1  OR c.id IN (:#{#request.color})) 
                AND (:#{#request.material.size()} < 1  OR m.id IN (:#{#request.material})) 
                AND (:#{#request.brand.size()} < 1 OR b.id IN (:#{#request.brand})) 
                AND (:#{#request.sole.size()} < 1 OR s.id IN (:#{#request.sole})) 
                AND (:#{#request.lstSize.size()} < 1 OR si.id IN (:#{#request.lstSize}))
                AND( (:#{#request.nameProductDetail} IS NULL OR p.name like %:#{#request.nameProductDetail}%) 
                OR (:#{#request.nameProductDetail} IS NULL OR ca.name like %:#{#request.nameProductDetail}%) 
                OR (:#{#request.nameProductDetail} IS NULL OR c.name like %:#{#request.nameProductDetail}%) 
                OR (:#{#request.nameProductDetail} IS NULL OR s.name like %:#{#request.nameProductDetail}%) 
                OR (:#{#request.nameProductDetail} IS NULL OR b.name like %:#{#request.nameProductDetail}%) 
                OR (:#{#request.nameProductDetail} IS NULL OR si.size like %:#{#request.nameProductDetail}%) 
                OR (:#{#request.nameProductDetail} IS NULL OR m.name like %:#{#request.nameProductDetail}%)) 
                GROUP BY pd.id
            """, nativeQuery = true)
    List<ClientProductResponse> getAllProductClient(@Param("request") ClientFindProductRequest request);
    @Query(value = """ 
                  select  pd.id as id,
                    MAX(pr.value) as value,
                    CONCAT(p.name, ' ', m.name, ' ', s.name) AS name,
                    ca.name as nameCate,
                    b.name as nameBrand,
                    c.code as codeColor,
                    c.name as nameColor,
                    si.size as size,
                    pd.price as price,
                    pd.weight as weight,
                    sum(bd.quantity) as amount,
                    pd.description as description,
                    GROUP_CONCAT(DISTINCT i.url) as image,
                    pd.id_product,
                    pd.id_color,
                    pd.id_material,
                    pd.id_sole,
                    pd.id_category,
                    pd.id_brand
                FROM product_detail pd
                        LEFT JOIN product_promotion pp on pp.id_product_detail = pd.id
                        LEFT JOIN promotion pr on pr.id = pp.id_promotion and pr.status = 1
                         JOIN
                     product p ON p.id = pd.id_product
                         JOIN
                     size si ON si.id = pd.id_size
                         JOIN
                     color c ON c.id = pd.id_color
                         JOIN
                     category ca ON ca.id = pd.id_category
                         JOIN
                     brand b ON b.id = pd.id_brand
                         JOIN
                     sole s ON s.id = pd.id_sole
                         JOIN
                     material m ON m.id = pd.id_material
                         LEFT JOIN
                     image i ON pd.id = i.id_product_detail
                        join bill_detail bd on bd.id_product_detail = pd.id and bd.status = 0
                        join bill bi on bd.id_bill = bi.id and bi.status = 7
                WHERE p.deleted = 0 AND pd.deleted = 0 AND pd.amount > 0
                GROUP BY pd.id
                ORDER BY amount DESC
            """, nativeQuery = true)
    List<ClientProductResponse> getSellingProduct(@Param("request") ClientProductRequest request);

    @Query(value = """ 
                  select  pd.id as id,
                    MAX(pr.value) as value,
                    CONCAT(p.name, ' ', m.name, ' ', s.name) AS name,
                   (pr.time_end) as timeRemainingInSeconds,
                    ca.name as nameCate,
                    b.name as nameBrand,
                    c.code as codeColor,
                    c.name as nameColor,
                    si.size as size,
                    pd.price as price,
                    pd.weight as weight,
                    (pd.amount) as amount,
                    pd.description as description,
                    GROUP_CONCAT(DISTINCT i.url) as image,
                    pd.id_product,
                    pd.id_color,
                    pd.id_material,
                    pd.id_sole,
                    pd.id_category,
                    pd.id_brand
                FROM product_detail pd
                        LEFT JOIN product_promotion pp on pp.id_product_detail = pd.id
                        LEFT JOIN promotion pr on pr.id = pp.id_promotion and pr.status = 1
                         JOIN
                     product p ON p.id = pd.id_product
                         JOIN
                     size si ON si.id = pd.id_size
                         JOIN
                     color c ON c.id = pd.id_color
                         JOIN
                     category ca ON ca.id = pd.id_category
                         JOIN
                     brand b ON b.id = pd.id_brand
                         JOIN
                     sole s ON s.id = pd.id_sole
                         JOIN
                     material m ON m.id = pd.id_material
                         LEFT JOIN
                     image i ON pd.id = i.id_product_detail
                WHERE p.deleted = 0 AND pd.deleted = 0 AND pd.amount > 0
                GROUP BY pd.id,pr.time_end
                having value > 50
                ORDER BY value DESC
            """, nativeQuery = true)
    List<ClientProductResponse> getSaleProduct(@Param("request") ClientProductRequest request);

    @Query(value = """
                select  pd.id as id,
                    MAX(pr.value) as value,
                    CONCAT(p.name, ' ', m.name, ' ', s.name) AS name,
                    ca.name as nameCate,
                    b.name as nameBrand,
                    c.code as codeColor,
                    c.name as nameColor,
                    si.size as size,
                    pd.price as price,
                    pd.weight as weight,
                    pd.amount as amount,
                    pd.description as description,
                    GROUP_CONCAT(DISTINCT i.url) as image,
                    pd.id_product,
                    pd.id_color,
                    pd.id_material,
                    pd.id_sole,
                    pd.id_category,
                    pd.id_brand
                FROM product_detail pd
                        LEFT JOIN product_promotion pp on pp.id_product_detail = pd.id
                        LEFT JOIN promotion pr on pr.id = pp.id_promotion and pr.status = 1
                         JOIN
                     product p ON p.id = pd.id_product
                         JOIN
                     size si ON si.id = pd.id_size
                         JOIN
                     color c ON c.id = pd.id_color
                         JOIN
                     category ca ON ca.id = pd.id_category
                         JOIN
                     brand b ON b.id = pd.id_brand
                         JOIN
                     sole s ON s.id = pd.id_sole
                         JOIN
                     material m ON m.id = pd.id_material
                         LEFT JOIN
                     image i ON pd.id = i.id_product_detail
                WHERE p.deleted = 0 AND pd.deleted = 0 AND pd.amount > 0
                GROUP BY pd.id
                ORDER BY pd.created_at DESC
            """, nativeQuery = true)
    List<ClientProductResponse> getProductsHome(@Param("request") ClientProductRequest request);

    @Query(value = """
                SELECT 
                       pd.id as id,
                       MAX(pr.value) as value,
                       CONCAT(p.name, ' ', m.name, ' ', s.name) AS name,
                       ca.name as nameCate,
                       b.name as nameBrand,
                       c.code as codeColor,
                       c.name as nameColor,
                       si.size as size,
                       pd.price as price,
                       pd.weight as weight,
                       pd.amount as amount,
                       pd.description as description,
                       GROUP_CONCAT(DISTINCT i.url) as image,
                       pd.id_product,
                       pd.id_color,
                       pd.id_material,
                       pd.id_sole,
                       pd.id_category,
                       pd.id_brand
                FROM product_detail pd
                         JOIN
                     product p ON p.id = pd.id_product
                         JOIN
                     size si ON si.id = pd.id_size
                         JOIN
                     color c ON c.id = pd.id_color
                         JOIN
                     category ca ON ca.id = pd.id_category
                         JOIN
                     brand b ON b.id = pd.id_brand
                         JOIN
                     sole s ON s.id = pd.id_sole
                         JOIN
                     material m ON m.id = pd.id_material
                         LEFT JOIN
                     image i ON pd.id = i.id_product_detail
                     LEFT JOIN product_promotion pp ON pd.id = pp.id_product_detail
                         LEFT JOIN promotion pr ON pr.id = pp.id_promotion
                WHERE pd.id = :id 
                GROUP BY pd.id
            """, nativeQuery = true)
    ClientProductResponse updateRealTime(String id);

    @Query(value = """
                SELECT MAX(pd.id) as id,
                MAX( pr.id) as promotion ,
                MAX( pr.status) as statusPromotion ,
                MAX(pr.value) as value,
                MAX(si.size) as size,
                       CONCAT(p.name, ' ', m.name, ' ', s.name) AS name,
                       ca.name as nameCate,
                       b.name as nameBrand,
                       MAX(pd.price) as price,
                       MAX(pd.weight) as weight,
                       MAX(pd.amount) as amount,
                       MAX(pd.description) as description,
                       GROUP_CONCAT(DISTINCT i.url) as image,
                       pd.id_size as idSize,
                       pd.id_product,
                       pd.id_color,
                       pd.id_material,
                       pd.id_sole,
                       pd.id_category,
                       pd.id_brand
                FROM product_detail pd
                         JOIN
                     product p ON p.id = pd.id_product
                         JOIN
                     color c ON c.id = pd.id_color
                         JOIN
                     category ca ON ca.id = pd.id_category
                         JOIN
                     size si ON si.id = pd.id_size
                         JOIN
                     brand b ON b.id = pd.id_brand
                         JOIN
                     sole s ON s.id = pd.id_sole
                         JOIN
                     material m ON m.id = pd.id_material
                         LEFT JOIN
                     image i ON pd.id = i.id_product_detail
                     LEFT JOIN product_promotion pp ON pd.id = pp.id_product_detail
                         LEFT JOIN promotion pr ON pr.id = pp.id_promotion
                WHERE (:#{#id} is null or pd.id = :#{#id})
                AND p.deleted = 0 AND pd.deleted = 0 AND pd.amount > 0
                GROUP BY pd.id_product,
                pd.id_color,
                pd.id_material,
                pd.id_sole,
                pd.id_category,
                pd.id_brand,
                pd.id_size
            """, nativeQuery = true)
    ClientProductResponse getProductById(String id);

    @Query(value = """
            SELECT
                pd.id as id,
                    MAX(pr.value) as value,
                    CONCAT(p.name, ' ', m.name, ' ', s.name) AS name,
                    ca.name as nameCate,
                    b.name as nameBrand,
                    c.code as codeColor,
                    c.name as nameColor,
                    si.size as size,
                    pd.price as price,
                    pd.weight as weight,
                    pd.amount as amount,
                    pd.description as description,
                    GROUP_CONCAT(DISTINCT i.url) as image,
                    pd.id_product,
                    pd.id_color,
                    pd.id_material,
                    pd.id_sole,
                    pd.id_category,
                    pd.id_brand
                FROM product_detail pd
                        LEFT JOIN product_promotion pp on pp.id_product_detail = pd.id
                        LEFT JOIN promotion pr on pr.id = pp.id_promotion and pr.status = 1
                         JOIN
                     product p ON p.id = pd.id_product
                         JOIN
                     size si ON si.id = pd.id_size
                         JOIN
                     color c ON c.id = pd.id_color
                         JOIN
                     category ca ON ca.id = pd.id_category
                         JOIN
                     brand b ON b.id = pd.id_brand
                         JOIN
                     sole s ON s.id = pd.id_sole
                         JOIN
                     material m ON m.id = pd.id_material
                         LEFT JOIN
                     image i ON pd.id = i.id_product_detail
            WHERE
                p.id <> :#{#request.product}
                AND ca.id = :#{#request.category}
                AND b.id = :#{#request.brand}
            GROUP BY
                pd.id
            """, nativeQuery = true)
    List<ClientProductResponse> getProductCungLoai(@Param("request") ClientProductCungLoaiRequest request);

    @Query(value = """
                SELECT pd.id as id,
                       si.size as size,
                       pd.price as gia,
                       pd.weight as weight
                FROM product_detail pd
                         JOIN
                     product p ON p.id = pd.id_product
                         JOIN
                     color c ON c.id = pd.id_color
                         JOIN
                     category ca ON ca.id = pd.id_category
                         JOIN
                     brand b ON b.id = pd.id_brand
                         JOIN
                     sole s ON s.id = pd.id_sole
                         JOIN
                     material m ON m.id = pd.id_material
                         JOIN
                     size si ON si.id = pd.id_size
                 WHERE pd.id_product = :#{#request.idProduct}
                 AND pd.id_color = :#{#request.idColor}
                 AND pd.id_category = :#{#request.idCategory}
                 AND pd.id_brand = :#{#request.idBrand}
                 AND pd.id_sole = :#{#request.idSole}
                 AND pd.id_material = :#{#request.idMaterial}
                 AND p.deleted = 0 AND pd.deleted = 0 AND pd.amount > 0
                 ORDER BY si.size
            """, nativeQuery = true)
    List<ClientProductDetailResponse> getAllSize(ClientProductDetailRequest request);

    @Query(value = """
            SELECT
                MAX(CASE WHEN pd.id_size = :#{#request.idSize} THEN pd.id ELSE(
               SELECT pd_inner.id
                        FROM product_detail pd_inner
                        WHERE pd_inner.id_product = :#{#request.idProduct}
                            AND pd_inner.id_category = :#{#request.idCategory}
                            AND pd_inner.id_brand = :#{#request.idBrand}
                            AND pd_inner.id_sole = :#{#request.idSole}
                            AND pd_inner.id_material = :#{#request.idMaterial}
                            AND pd_inner.id_color = c.id
                            AND pd_inner.deleted = 0
                        LIMIT 1
                ) END) AS id,
                c.id as idColor,
                c.name as nameColor,
                c.code as codeColor,
                GROUP_CONCAT(DISTINCT pd.id_size) as id_sizes,
                MIN(si.size) as size
            FROM
                product_detail pd
            JOIN
                product p ON p.id = pd.id_product
            JOIN
                color c ON c.id = pd.id_color
            JOIN
                category ca ON ca.id = pd.id_category
            JOIN
                brand b ON b.id = pd.id_brand
            JOIN
                sole s ON s.id = pd.id_sole
            JOIN
                material m ON m.id = pd.id_material
            LEFT JOIN
                size si ON si.id = :#{#request.idSize} AND pd.id_size = si.id
            WHERE
                pd.id_product = :#{#request.idProduct}
                AND pd.id_category = :#{#request.idCategory}
                AND pd.id_brand = :#{#request.idBrand}
                AND pd.id_sole = :#{#request.idSole}
                AND pd.id_material = :#{#request.idMaterial}
                AND p.deleted = 0
                AND pd.deleted = 0 
                AND pd.amount > 0
            GROUP BY
                c.id;
            """, nativeQuery = true)
    List<ClientProductDetailResponse> getAllColor(ClientProductDetailRequest request);




    @Query(value = """
            SELECT min(pd.price) as minPrice, max(pd.price) as maxPrice
            FROM product_detail pd
                 WHERE pd.deleted = 0 AND pd.amount > 0
            """, nativeQuery = true)
    ClientMinMaxPrice getMinMaxPriceProductClient();
}
