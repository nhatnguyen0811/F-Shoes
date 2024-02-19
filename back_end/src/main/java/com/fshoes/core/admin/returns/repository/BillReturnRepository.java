package com.fshoes.core.admin.returns.repository;

import com.fshoes.entity.Bill;
import com.fshoes.infrastructure.constant.StatusBillDetail;
import com.fshoes.repository.BillRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BillReturnRepository extends BillRepository {

    @Query(value = """
            SELECT b.id
            FROM bill b
            WHERE b.code = :code
              AND b.status = 7
              AND b.total_money > b.money_reduced
              AND b.complete_date >= :date
              AND NOT EXISTS (SELECT 1 FROM bill_detail WHERE id_bill = b.id AND status = 2)
            """, nativeQuery = true)
    String getBillReturn(@Param("code") String code, @Param("date") Long date);


    @Query(value = """
            SELECT b
            FROM Bill b
            WHERE b.id = :id
              AND b.status = 7
              AND b.totalMoney > b.moneyReduced
              AND b.completeDate >= :date
              AND NOT EXISTS
              (SELECT 1 FROM BillDetail bd WHERE bd.bill.id  = b.id AND bd.status = :status)
            """)
    Optional<Bill> findBillId(@Param("id") String id,
                              @Param("date") Long date,
                              @Param("status") StatusBillDetail status);
}
