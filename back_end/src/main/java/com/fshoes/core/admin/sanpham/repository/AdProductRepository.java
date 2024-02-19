package com.fshoes.core.admin.sanpham.repository;

import com.fshoes.core.admin.sanpham.model.request.ProductFilterRequest;
import com.fshoes.core.admin.sanpham.model.respone.ProductResponse;
import com.fshoes.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdProductRepository extends ProductRepository {


    @Query(value = """
            select ROW_NUMBER() over (ORDER BY p.updated_at desc ) as stt,p.id, p.name,
                count(pd.id) as amount, p.deleted as status, p.created_at as createdAt
                from product p
                join product_detail pd
                on p.id = pd.id_product
                where (:#{#filter.name} is null or p.name like %:#{#filter.name}%)
                and (:#{#filter.status} is null or p.deleted = :#{#filter.status})
                group by p.name, p.deleted,p.id
                """, nativeQuery = true)
    Page<ProductResponse> getAllProduct(ProductFilterRequest filter, Pageable pageable);

    @Query(value = """
            select ROW_NUMBER() over (ORDER BY p.updated_at desc ) as stt,p.id, p.name,
                count(pd.id) as amount, p.deleted as status, p.created_at as createdAt
                from product p
                join product_detail pd
                on p.id = pd.id_product
                group by p.name, p.deleted,p.id
            """, nativeQuery = true)
    List<ProductResponse> getListProduct();


    @Query(value = """
            select p.name
                from product p
            """, nativeQuery = true)
    List<String> getAllName();
}
