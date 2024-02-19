package com.fshoes.core.admin.sell.repository;

import com.fshoes.entity.BillDetail;
import com.fshoes.repository.BillDetailRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminBillDetailRepositoty extends BillDetailRepository {

    @Query(value = """
                select * from bill_detail bd where bd.id_product_detail = :productDetailId and bd.id_bill = :billId
            """, nativeQuery = true)
    BillDetail findByProductIdAndBillId(String productDetailId, String billId);


    @Query(value = """
              select id from bill_detail where id_bill = ?
            """, nativeQuery = true)
    List<String> findByBillId(String billId);

    @Query(value = """
              select id_product_detail from bill_detail where id_bill = ?
            """, nativeQuery = true)
    List<String> findByProductDetailBYBillId(String billId);

    @Query(value = """
            select quantity
            from bill_detail
            where id_bill = ? and id_product_detail = ?
            """, nativeQuery = true)
    Integer quantityProductDetail(String idBill, String idPrDetail);

    @Query(value = """
            select id
            from bill_detail
            where id_bill = ? and id_product_detail = ?
            """, nativeQuery = true)
    String idBillDetailProductDetail(String idBill, String idPrDetail);

    @Query(value = """
            select id
            from bill_detail
            where id_bill = :idBill and id_product_detail in :idPrDetail
            """, nativeQuery = true)
    List<String> deleteBillDetailProductDetail(String idBill, @Param("idPrDetail") List<String> idPrDetail);


    @Query(value = """
                select quantity from bill_detail where id_bill = ? and id_product_detail = ?
            """, nativeQuery = true)
    Integer increaseQuantityBillDetail(String idBill, String idPrDetail);

    @Query(value = """
                select quantity from bill_detail where id_bill = ? and id_product_detail = ?
            """, nativeQuery = true)
    Integer decreaseQuantityBillDetail(String idBill, String idPrDetail);

    List<BillDetail> getBillDetailsByBillId(String idBill);

    @Query(value = "SELECT * FROM bill_detail WHERE id_bill IN :idBills", nativeQuery = true)
    List<BillDetail> getAllBillDetails(@Param("idBills") List<String> idBills);

}
