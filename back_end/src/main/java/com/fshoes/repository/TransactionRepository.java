package com.fshoes.repository;

import com.fshoes.core.admin.hoadon.model.respone.HDBillResponse;
import com.fshoes.entity.BillDetail;
import com.fshoes.entity.Transaction;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {
    @Transactional
    @Modifying
    @Query(value = """
            DELETE FROM transaction trans
            WHERE id_bill = :idBill
            """, nativeQuery = true)
    Integer deleteTransactionByIdBill(@Param("idBill") String idBill);

    @Query(value = "SELECT * FROM transaction WHERE id_bill IN :idBills", nativeQuery = true)
    List<Transaction> getAllTransactions(@Param("idBills") List<String> idBills);

    @Query(value = "SELECT * FROM transaction WHERE id_bill = :id", nativeQuery = true)
    List<Transaction> getTransactions(String id);
}
