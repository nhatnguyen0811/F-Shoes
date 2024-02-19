package com.fshoes.core.admin.sell.repository;

import com.fshoes.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminCreateCartRepository extends JpaRepository<Cart, String> {
//    @Modifying
//    @Query(value = """
//            INSERT INTO bills (code, full_name as fullName, phone_number as phoneNumber, address, total_money as totalMoney,
//            money_reduced as moneyReduced, money_after as moneyAfter,
//            ship_date as shipDate, receive_date as receiveDate, money_ship as moneyShip, confirmation_date as confirmationDate, type,
//             note, customer_amount as customerAmount, desired_receipt_date as desiredReceiptDate,
//            complete_date as completeDate, status, customer_id as customerId, voucher_id as voucherId)
//            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//            """,nativeQuery = true)
//    Bill createBill(@Param("request")CreateBillRequest request);

    @Query(value = """
            select c.id from Cart c
            """, nativeQuery = true)
    List<Cart> getAllCarrt();
}
