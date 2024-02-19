package com.fshoes.core.admin.sell.repository;

import com.fshoes.core.admin.sell.model.response.PayOrderResponse;
import com.fshoes.entity.Bill;
import com.fshoes.repository.BillRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminBillRepository extends BillRepository {

    Boolean existsByCode(String code);

    @Query(value = """
            select * from bill where status = 8 
            """, nativeQuery = true)
    List<Bill> getAllBillTaoDonHang();

    @Query(value = """
            select t.id as idTransaction, t.transaction_code as transactionCode, b.id, t.total_money as totalMoney, b.customer_amount as customerAmount , b.note, t.payment_method as paymentMethod from bill b  
            join  transaction t on t.id_bill = b.id where t.id_bill = :idBill 
            """, nativeQuery = true)
    List<PayOrderResponse> getPayOrder(String idBill);

}
