package com.fshoes.core.admin.sell.repository;

import com.fshoes.entity.Transaction;
import com.fshoes.repository.TransactionRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;


@Repository
public interface AdminTransactionRepository extends TransactionRepository {

    @Query(value = """
                SELECT * from transaction t where t.id_bill = :idBill 
            """, nativeQuery = true)
    Transaction getTransactionByIdBill(String idBill);

    @Query(value = """
               select sum(total_money) as totalMoney from transaction where id_bill = :idBill
            """, nativeQuery = true)
    BigDecimal getTotalMoneyPayOrder(String idBill);
}
