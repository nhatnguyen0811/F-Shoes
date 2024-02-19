package com.fshoes.core.admin.returns.repository;

import com.fshoes.core.admin.returns.model.response.BillDetailReturnResponse;
import com.fshoes.entity.BillDetail;
import com.fshoes.infrastructure.constant.StatusBillDetail;
import com.fshoes.repository.BillDetailRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillDetailReturnRepository extends BillDetailRepository {

    @Query(value = """
                select bd.id, bd.quantity, bd.price,
                 CONCAT(p.name, ' ', m.name, ' ', s.name, ' "', c.name,'"', ' [', si.size, ']') AS name,
                 GROUP_CONCAT(DISTINCT i.url) as image
                 from bill_detail bd
                 JOIN product_detail pd on bd.id_product_detail = pd.id
                 JOIN product p ON p.id = pd.id_product
                 JOIN color c ON c.id = pd.id_color
                 JOIN category ca ON ca.id = pd.id_category
                 JOIN brand b ON b.id = pd.id_brand
                 JOIN sole s ON s.id = pd.id_sole
                 JOIN material m ON m.id = pd.id_material
                 JOIN size si ON si.id = pd.id_size
                 LEFT JOIN image i ON pd.id = i.id_product_detail
                 where bd.id_bill = :idBill and bd.status = 0
                 GROUP BY bd.id, bd.quantity, bd.price
            """, nativeQuery = true)
    List<BillDetailReturnResponse> getBillDetailReturn(String idBill);

    Optional<BillDetail> findByProductDetailIdAndStatusAndBillId(String idProductDetail, StatusBillDetail statusBillDetail, String billId);
}
