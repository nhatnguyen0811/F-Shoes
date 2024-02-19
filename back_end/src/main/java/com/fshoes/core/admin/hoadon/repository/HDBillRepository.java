package com.fshoes.core.admin.hoadon.repository;

import com.fshoes.core.admin.hoadon.model.request.HDNhanVienSearchRequest;
import com.fshoes.core.admin.hoadon.model.respone.HDBillResponse;
import com.fshoes.core.admin.hoadon.model.respone.HDNhanVienResponse;
import com.fshoes.repository.BillRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface HDBillRepository extends BillRepository {
    Boolean existsByCode(String code);

    @Query(value = """
            SELECT ROW_NUMBER() over (ORDER BY b.created_at desc ) as stt,
            b.id, b.code, c.full_name as fullName,
            c.phone_number as phoneNumber, b.address,
            b.total_money as totalMoney, b.money_reduced as moneyReduced,
            b.money_after as moneyAfter, b.money_ship as moneyShip,
            b.type, b.note, b.created_at as createdAt,
            b.created_by as createdBy, sum(bt.quantity) as totalProduct, b.status
            FROM bill b
            LEFT JOIN bill_detail bt ON b.id = bt.id_bill
            LEFT JOIN account c ON b.id_customer = c.id
            WHERE (:status IS NULL OR b.status = :status)
            AND (:startDate IS NULL OR b.created_at >= :startDate
            AND :endDate IS NULL OR b.created_at <= :endDate)
            AND (:type IS NULL OR b.type = :type)
            AND (
                b.code like concat('%', :inputSearch, '%')
                OR b.full_name LIKE concat('%', :inputSearch, '%')
                OR b.phone_number LIKE CONCAT('%', :inputSearch, '%')
                OR c.full_name LIKE CONCAT('%', :inputSearch, '%')
                OR c.phone_number LIKE CONCAT('%', :inputSearch, '%')
                OR c.email LIKE CONCAT('%', :inputSearch, '%')
            )
            AND b.status <> 8
            GROUP BY b.id, b.code, c.full_name, c.phone_number, b.address,
            b.total_money, b.money_reduced, b.money_after, b.money_ship,
            b.type,b.note, b.created_at,b.created_by,b.status, b.updated_at
            ORDER BY b.updated_at DESC
            """, nativeQuery = true)
    Page<HDBillResponse> filterBill(
            Pageable pageable,
            @Param("status") Integer status,
            @Param("startDate") Long startDate,
            @Param("endDate") Long endDate,
            @Param("type") Boolean type,
            @Param("inputSearch") String inputSearch
    );

    @Query(value = """
            SELECT ROW_NUMBER() over (ORDER BY b.created_at desc ) as stt,
            b.id, b.code, c.full_name as fullName,
            c.phone_number as phoneNumber, b.address,
            b.total_money as totalMoney, b.money_reduced as moneyReduced,
            b.money_after as moneyAfter, b.money_ship as moneyShip,
            b.type, b.note, b.created_at as createdAt,
            b.created_by as createdBy, sum(bt.quantity) as totalProduct, b.status
            FROM bill b
            LEFT JOIN bill_detail bt ON b.id = bt.id_bill
            LEFT JOIN account c ON b.id_customer = c.id
            WHERE (:status IS NULL OR b.status = :status)
            AND (:startDate IS NULL OR b.created_at >= :startDate
            AND :endDate IS NULL OR b.created_at <= :endDate)
            AND (:type IS NULL OR b.type = :type)
            AND (
                    (b.type = 1 AND b.status = 1) OR
                    (EXISTS (SELECT 1 FROM bill_history bh WHERE bh.id_bill = b.id AND bh.id_reception_staff = :idUserLogin))
                    OR
                    (EXISTS (SELECT 1 FROM bill_history bh WHERE bh.id_bill = b.id AND bh.id_account = :idUserLogin))
                    OR
                    (b.status <> 1 AND b.created_by = :email)
            )
            AND (
                b.code like concat('%', :inputSearch, '%')
                OR b.full_name LIKE concat('%', :inputSearch, '%')
                OR b.phone_number LIKE CONCAT('%', :inputSearch, '%')
                OR c.full_name LIKE CONCAT('%', :inputSearch, '%')
                OR c.phone_number LIKE CONCAT('%', :inputSearch, '%')
                OR c.email LIKE CONCAT('%', :inputSearch, '%')
            )
            AND b.status <> 8
            GROUP BY b.id, b.code, c.full_name, c.phone_number, b.address,
            b.total_money, b.money_reduced, b.money_after, b.money_ship,
            b.type,b.note, b.created_at,b.created_by,b.status, b.updated_at
            ORDER BY b.updated_at DESC
            """, nativeQuery = true)
    Page<HDBillResponse> filterBillByStaff(
            Pageable pageable,
            @Param("status") Integer status,
            @Param("startDate") Long startDate,
            @Param("endDate") Long endDate,
            @Param("type") Boolean type,
            @Param("inputSearch") String inputSearch,
            @Param("idUserLogin") String idUserLogin,
            @Param("email") String email
    );


    @Query(value = """
            SELECT ROW_NUMBER() over (ORDER BY b.created_at desc ) as stt,
            b.id, b.code, c.full_name as fullName,
            c.phone_number as phoneNumber, b.address,
            b.total_money as totalMoney, b.money_reduced as moneyReduced,
            b.money_after as moneyAfter, b.money_ship as moneyShip,
            b.type, b.note, b.created_at as createdAt,
            b.created_by as creatdeBy, sum(bt.quantity) as totalProduct, b.status
            FROM bill b
            LEFT JOIN bill_detail bt ON b.id = bt.id_bill
            LEFT JOIN account c ON b.id_customer = c.id
            WHERE b.id = :id
            GROUP BY b.id, b.code, c.full_name, c.phone_number, b.address,
            b.total_money, b.money_reduced, b.money_after, b.money_ship,
            b.type,b.note, b.created_at,b.created_by,b.status, b.updated_at
            ORDER BY b.updated_at DESC
            """, nativeQuery = true)
    HDBillResponse realTimeBill(String id);

    @Query(value = """
            SELECT 1 as stt,
            b.id, b.code, c.full_name as fullName,
            c.phone_number as phoneNumber, b.address,
            b.total_money as totalMoney, b.money_reduced as moneyReduced,
            b.money_after as moneyAfter, b.money_ship as moneyShip,
            b.type, b.note, b.created_at as createdAt,
            b.created_by as creatdeBy, sum(bt.quantity) as totalProduct, b.status
            FROM bill b
            LEFT JOIN bill_detail bt ON b.id = bt.id_bill
            LEFT JOIN account c ON b.id_customer = c.id
            WHERE b.id = :idBill
            AND b.status <> 8
            GROUP BY b.id, b.code, c.full_name, c.phone_number, b.address,
            b.total_money, b.money_reduced, b.money_after, b.money_ship,
            b.type,b.note, b.created_at,b.created_by,b.status, b.updated_at
            ORDER BY b.updated_at DESC
            """, nativeQuery = true)
    HDBillResponse findBill(@Param("idBill") String id);

    @Query(value = """
            SELECT b.id, b.code, c.full_name as fullName,
                  c.phone_number as phoneNumber,
                  c.id as idCustomer, b.address,
                  b.total_money as totalMoney, b.money_reduced as moneyReduced,
                  b.money_after as moneyAfter, b.money_ship as moneyShip,
                  b.type, b.note, b.created_at as createdAt,
                  b.created_by as creatdeBy, sum(bt.quantity) as totalProduct, b.status,
                  b.full_name as recipientName, b.phone_number as recipientPhoneNumber,
                  c.email as emailCustomer,
                  b.desired_receipt_date as desiredReceiptDate, b.customer_amount as customerAmount, b.receiving_method as receivingMethod            FROM bill b
                  LEFT JOIN bill_detail bt ON b.id = bt.id_bill
                  LEFT JOIN account c ON b.id_customer= c.id
            WHERE b.id = :id AND b.status <> 8
                   
            """, nativeQuery = true)
    HDBillResponse getBillResponse(@Param("id") String id);

    @Query(value = """
            SELECT b.id, b.code, c.full_name as fullName,
                  c.phone_number as phoneNumber,
                  c.id as idCustomer, b.address,
                  b.total_money as totalMoney, b.money_reduced as moneyReduced,
                  b.money_after as moneyAfter, b.money_ship as moneyShip,
                  b.type, b.note, b.created_at as createdAt,
                  b.created_by as creatdeBy, sum(bt.quantity) as totalProduct, b.status,
                  b.full_name as recipientName, b.phone_number as recipientPhoneNumber,
                  c.email as emailCustomer,
                  b.desired_receipt_date as desiredReceiptDate, b.customer_amount as customerAmount, b.receiving_method as receivingMethod            
                  FROM bill b
                  LEFT JOIN bill_detail bt ON b.id = bt.id_bill
                  LEFT JOIN account c ON b.id_customer= c.id
            WHERE b.id = :id AND b.status <> 8
                AND (
                    (EXISTS (SELECT 1 FROM account acc WHERE acc.id = :idUserLogin AND acc.role = 1)) OR
                    (b.type = 1 AND b.status = 1) OR
                    (EXISTS (SELECT 1 FROM bill_history bh WHERE bh.id_bill = b.id AND bh.id_reception_staff = :idUserLogin))
                    OR
                    (EXISTS (SELECT 1 FROM bill_history bh WHERE bh.id_bill = b.id AND bh.id_account = :idUserLogin))
                    OR
                    (b.type = 0 AND b.created_by = :email)
            ) 
                   
            """, nativeQuery = true)
    HDBillResponse getBillExist(@Param("id") String id,
                                @Param("idUserLogin") String idUserLogin,
                                @Param("email") String email);

    @Query(value = "SELECT ROW_NUMBER() OVER (ORDER BY a.created_at DESC) as stt, a.id, a.code, a.avatar, a.email, " +
            "a.full_name as fullName, a.date_birth as dateBirth, a.phone_number as phoneNumber, " +
            "a.gender, a.created_at as createdAt, a.status " +
            "FROM account a " +
            "LEFT JOIN bill_history bh ON a.id = bh.id_account OR a.id = bh.id_reception_staff " +
            "WHERE a.role = 0 " +
            "AND NOT EXISTS (SELECT 1 FROM bill_history bh_inner WHERE bh_inner.id_account = a.id OR bh_inner.id_reception_staff = a.id AND bh_inner.id_bill = :billId) " +
            "AND a.status = 0 " +
            "AND (:#{#hdNhanVienSearchRequest.txtSearch} IS NULL OR " +
            "a.full_name LIKE %:#{#hdNhanVienSearchRequest.txtSearch}% OR " +
            "a.email LIKE %:#{#hdNhanVienSearchRequest.txtSearch}% OR " +
            "a.phone_number LIKE %:#{#hdNhanVienSearchRequest.txtSearch}%) " +
            "ORDER BY a.created_at DESC", nativeQuery = true)
    Page<HDNhanVienResponse> getListNhanVien(@Param("billId") String billId,
                                             @Param("hdNhanVienSearchRequest") HDNhanVienSearchRequest hdNhanVienSearchRequest,
                                             Pageable pageable);


//    @Query(value = "Select ROW_NUMBER() over (ORDER BY a.created_at desc ) as stt, a.id, a.code, a.avatar, a.email, a.full_name as fullName," +
//            "a.date_birth as dateBirth, a.phone_number as phoneNumber," +
//            "a.gender, a.created_at as createdAt, a.status from account a " +
//            "LEFT JOIN bill_history bh ON a.id = bh.id_account OR a.id = bh.id_reception_staff " +
//            "WHERE a.role = 0 " +
//            "AND bh.id_bill = :billId " +
//            "AND (:#{#hdNhanVienSearchRequest.txtSearch} IS NULL OR " +
//            "a.full_name LIKE %:#{#hdNhanVienSearchRequest.txtSearch}% OR " +
//            "a.email LIKE %:#{#hdNhanVienSearchRequest.txtSearch}% OR " +
//            "a.phone_number LIKE %:#{#hdNhanVienSearchRequest.txtSearch}%) ", nativeQuery = true)
//    Page<HDNhanVienResponse> getListNhanVien(@Param("billId") String billId,
//                                             @Param("hdNhanVienSearchRequest") HDNhanVienSearchRequest hdNhanVienSearchRequest,
//                                             Pageable pageable);

}
