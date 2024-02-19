package com.fshoes.core.client.model.response;

import com.fshoes.entity.base.IsIdentified;
import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;

public interface ClientGetAllBillTableResponse extends IsIdentified {
    @Value("#{target.id_customer}")
    String getCustomer();

    String getNameProduct();

    String getCode();

    Integer getStatus();

    @Value("#{target.created_at}")
    Long getCreatedAt();

    @Value("#{target.desired_receipt_date}")
    Long getDesiredReceiptDate();

    @Value("#{target.complete_date}")
    Long getCompleteDate();

    @Value("#{target.money_ship}")
    BigDecimal getMoneyShip();

    @Value("#{target.money_after}")
    BigDecimal getMoneyAfter();
}
