package com.fshoes.core.admin.hoadon.repository;

import com.fshoes.core.admin.hoadon.model.respone.HDBillDetailResponse;
import com.fshoes.core.admin.voucher.model.respone.AdVoucherRespone;
import com.fshoes.entity.BillDetail;
import com.fshoes.repository.BillDetailRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface HDBillDetailRepository extends BillDetailRepository {

    BillDetail getBillDetailByBillIdAndProductDetailId(String idBill, String idProductDetail);

    @Transactional
    @Modifying
    @Query(value = """
            DELETE FROM bill_detail bd WHERE id_bill = :billId
            """, nativeQuery = true)
    void deleteByBillId(@Param("billId") String billId);

    @Query(value = """
            SELECT bd.id, b.id as idBill, MIN(i.url) as productImg,
                    CONCAT(p.name, ' ', c.name) as productName,
                    bd.price, pd.price as productPrice, s.size as size, bd.quantity, pd.id as productDetailId,
                    bd.status as status, bd.note as note, pd.weight as weight
             FROM bill_detail bd
                 LEFT JOIN product_detail pd ON bd.id_product_detail = pd.id
                 LEFT JOIN image i ON pd.id = i.id_product_detail
                 LEFT JOIN product p ON pd.id_product = p.id
                 LEFT JOIN size s ON pd.id_size = s.id
                 LEFT JOIN bill b ON bd.id_bill = b.id
                 LEFT JOIN color c ON pd.id_color = c.id
             WHERE b.id = :idBill
             GROUP BY bd.id, p.name, c.name, bd.price, pd.price, s.size, pd.id, bd.status;            """, nativeQuery = true)
    List<HDBillDetailResponse> getBillDetailsByBillId(@Param("idBill") String idBill);

    List<BillDetail> getBillDetailByBillId(String idBill);

    //    @Query(value = "Select ROW_NUMBER() over (ORDER BY created_at desc ) as stt, a.id, a.code, a.avatar, a.email, a.full_name as fullName," +
//            "a.date_birth as dateBirth, a.phone_number as phoneNumber," +
//            "a.gender, a.created_at as createdAt, a.status from account a " +
//            "LEFT JOIN bill_history bh on a.id = bh.id_account" +
//            "where a.role = 0 and (:#{#hdNhanVienSearchRequest.txtSearch} is null or a.full_name like %:#{#hdNhanVienSearchRequest.txtSearch}% " +
//            "or a.email like %:#{#hdNhanVienSearchRequest.txtSearch}% or a.phone_number like %:#{#hdNhanVienSearchRequest.txtSearch}%) " +
//            "order by a.created_at desc", nativeQuery = true)
//    Page<HDNhanVienResponse> getListNhanVien(Pageable pageable, HDNhanVienSearchRequest hdNhanVienSearchRequest);
    @Query(value = """
            SELECT bd.id, b.id as idBill,
                    bd.price, pd.price as productPrice,
                    bd.status as status, bd.note as note, pd.weight as weight, pd.id as productDetailId, bd.quantity
             FROM bill_detail bd
                 LEFT JOIN product_detail pd ON bd.id_product_detail = pd.id
                 LEFT JOIN bill b ON bd.id_bill = b.id
             WHERE b.id = :idBill AND pd.id = :idPrd 
             GROUP BY bd.id, bd.price, pd.price, pd.id, bd.status;            
             """, nativeQuery = true)
    List<HDBillDetailResponse> getBillDtResByIdBillAndIDPrd(@Param("idBill") String idBill, @Param("idPrd") String idPrd);

    @Query(value = """
            SELECT bd.id, b.id as idBill,
                    bd.price, pd.price as productPrice,
                    bd.status as status, bd.note as note, pd.weight as weight, pd.id as productDetailId, bd.quantity
             FROM bill_detail bd
                 LEFT JOIN product_detail pd ON bd.id_product_detail = pd.id
                 LEFT JOIN bill b ON bd.id_bill = b.id
             WHERE b.id = :idBill AND pd.id = :idPrd  AND bd.price = :price
             GROUP BY bd.id, bd.price, pd.price, pd.id, bd.status;            
             """, nativeQuery = true)
    HDBillDetailResponse getBillDtResByIdBillAndIDPrdAndPrice(@Param("idBill") String idBill, @Param("idPrd") String idPrd, @Param("price") BigDecimal price);

    @Query(value = """
            SELECT b.percent_money
            FROM bill b
            WHERE b.id = :idBill
            """, nativeQuery = true)
    BigDecimal getPercentInBill(String idBill);

    @Query(value = """
            select row_number()  OVER(ORDER BY v.created_at DESC) as stt,
            v.id, v.code, v.name, v.value, v.maximum_value as maximumValue,
            v.type, v.type_value as typeValue, v.minimum_amount as minimumAmount, v.quantity,
            v.start_date as startDate, v.end_date as endDate, v.status
            from voucher v
            where v.id =:id
            """, nativeQuery = true)
    Optional<AdVoucherRespone> getVoucherById(@Param("id") String id);
}
