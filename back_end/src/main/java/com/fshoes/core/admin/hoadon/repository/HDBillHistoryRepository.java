package com.fshoes.core.admin.hoadon.repository;

import com.fshoes.core.admin.hoadon.model.respone.HDBillHistoryResponse;
import com.fshoes.entity.Bill;
import com.fshoes.entity.BillDetail;
import com.fshoes.entity.BillHistory;
import com.fshoes.infrastructure.constant.StatusBill;
import com.fshoes.repository.BillHistoryRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HDBillHistoryRepository extends BillHistoryRepository {

    @Query(value = """
            SELECT bh.id, b.id as idBill, bh.created_at as createdAt, bh.status_bill as statusBill,a.code as codeAccount,
            bh.note as note, bh.created_by as createdBy, a.email as email, a.full_name as fullName, a.role
            FROM bill_history bh
            LEFT JOIN bill b ON bh.id_bill = b.id
            LEFT JOIN account a on a.email = bh.created_by
            WHERE b.id = :idBill
            ORDER BY bh.created_at
            """, nativeQuery = true)
    List<HDBillHistoryResponse> getListBillHistoryByIdBill(@Param("idBill") String idBill);

    @Query(value = """
                select  id from bill_history where id_bill = ?;
            """, nativeQuery = true)
    List<String> getIdHistoryByIdBill(String idBill);

    @Query(value = """
            SELECT bh 
            FROM BillHistory bh
            LEFT JOIN Bill b ON bh.bill.id = b.id
            WHERE b.id = :idBill AND bh.statusBill <> null  AND bh.statusBill <> 10
            ORDER BY bh.createdAt DESC
            LIMIT 2 
            """, nativeQuery = false)
    List<BillHistory> getBillHistoryNew(@Param("idBill") String idBill);

    Optional<BillHistory> findDistinctFirstByBillOrderByCreatedAtDesc(Bill bill);

    @Query(value = "SELECT * FROM bill_history WHERE id_bill IN :idBills", nativeQuery = true)
    List<BillHistory> getAllBillHistorys(@Param("idBills") List<String> idBills);
}
