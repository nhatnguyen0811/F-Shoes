package com.fshoes.core.client.repository;

import com.fshoes.core.client.model.response.ClientCartResponse;
import com.fshoes.entity.Cart;
import com.fshoes.repository.CartRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientCartRepository extends CartRepository {
    @Query(value = """
            SELECT MAX(pd.id) as id,
            CONCAT(p.name, ' ', m.name, ' ', s.name, ' "', co.name,'"') AS name,
            MAX(pd.price) as gia,
            MAX(pd.weight) as weight,
            MAX(c.quantity) as soLuong,
            MAX(si.size) as size,
            GROUP_CONCAT(DISTINCT i.url) as image
            FROM cart c
            JOIN product_detail pd ON pd.id = c.id_product_detail
            JOIN product p ON p.id = pd.id_product
            JOIN color co ON co.id = pd.id_color
            JOIN category ca ON ca.id = pd.id_category
            JOIN brand b ON b.id = pd.id_brand
            JOIN sole s ON s.id = pd.id_sole
            JOIN material m ON m.id = pd.id_material
            JOIN size si ON si.id = pd.id_size
            LEFT JOIN image i ON pd.id = i.id_product_detail where id_account = :idUser
            GROUP BY p.name, m.name, s.name, co.name
            """, nativeQuery = true)
    List<ClientCartResponse> getAllCart(String idUser);

    Optional<Cart> findByAccountIdAndProductDetailId(String idUser, String idProductDetail);

    List<Cart> findAllByAccountId(String accountId);
}
