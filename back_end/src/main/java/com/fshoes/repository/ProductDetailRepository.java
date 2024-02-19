package com.fshoes.repository;

import com.fshoes.entity.ProductDetail;
import com.fshoes.infrastructure.constant.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductDetailRepository extends JpaRepository<ProductDetail, String> {

    @Query(value = """
            select CONCAT(p.name, ' ', m.name, ' ', s.name, ' "', c.name, '"') AS name from product_detail pd
            JOIN product p ON p.id = pd.id_product
                JOIN color c ON c.id = pd.id_color
                JOIN category ca ON ca.id = pd.id_category
                JOIN brand b ON b.id = pd.id_brand
                JOIN sole s ON s.id = pd.id_sole
                JOIN material m ON m.id = pd.id_material where pd.id = :id
            """, nativeQuery = true)
    String getName(@Param("id") String id);

    @Query(value = """
            select pd from ProductDetail pd
            join Product p on p.id = pd.product.id
            where pd.id = :id and pd.amount >= :quantity
            and pd.deleted = :status and p.deleted = :status
            """)
    Optional<ProductDetail> checkQuantity(@Param("id") String id, Integer quantity, Status status);


}
