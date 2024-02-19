package com.fshoes.core.client.repository;

import com.fshoes.core.client.model.response.ClientTransactionResponse;
import com.fshoes.repository.TransactionRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientTransactionRepository extends TransactionRepository {
    @Query(value = """
            SELECT ts.id, ts.total_money as totalMoney, ts.type as type, ts.payment_method as paymentMethod,
            		ts.status as status, ts.note as note, st.full_name as fullName
            FROM transaction ts
                LEFT JOIN account st ON ts.id_account = st.id
                LEFT JOIN bill b ON ts.id_bill = b.id
            WHERE b.id = :idBill
            """, nativeQuery = true)
    List<ClientTransactionResponse> getTransactionByBillId(@Param("idBill") String idBill);
}
