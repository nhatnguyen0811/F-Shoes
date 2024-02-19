package com.fshoes.core.app;

import com.fshoes.entity.Bill;
import com.fshoes.infrastructure.constant.StatusBill;
import com.fshoes.repository.BillRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppBillOrderRepository extends BillRepository {

    @Query(value = """
            select b.id as idBill, a.id as idStaff from bill b
            join account a on a.email = b.created_by
            left join account a2 on a2.id = b.id_customer
            where b.status = 8 and (a2.phone_number = :text or b.code = :text)
            """,nativeQuery = true)
    AppCheckResponse findBillApp(@Param("text") String text);
}
