package com.fshoes.core.client.repository;

import com.fshoes.core.client.model.response.CLientBillHistoryResponse;
import com.fshoes.repository.BillHistoryRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientBillHistoryRepository extends BillHistoryRepository {
    @Query(value = """
            SELECT bh.id, b.id as idBill, bh.created_at as createdAt, bh.status_bill as statusBill,
            bh.note as note, bh.created_by as createdBy
            FROM bill_history bh LEFT JOIN bill b ON bh.id_bill = b.id
            WHERE b.id = :idBill    
            ORDER BY bh.created_at ASC                  
            """, nativeQuery = true)
    List<CLientBillHistoryResponse> getListBillHistoryByIdBill(@Param("idBill") String idBill);

    @Query(value = """
            SELECT bh.id, b.id as idBill, bh.created_at as createdAt, bh.status_bill as statusBill,
            bh.note as note, bh.created_by as createdBy
            FROM bill_history bh LEFT JOIN bill b ON bh.id_bill = b.id
            WHERE b.code = :code    
            ORDER BY bh.created_at ASC                  
            """, nativeQuery = true)
    List<CLientBillHistoryResponse> getListBillHistoryByCode(@Param("code") String code);
}
