package com.fshoes.core.admin.sell.model.response;

import com.fshoes.entity.base.IsIdentified;

import java.math.BigDecimal;

public interface PayOrderResponse extends IsIdentified {

    String getIdTransaction();

    BigDecimal getCustomerAmount();

    Integer getPaymentMethod();

    String getNote();

    BigDecimal getTotalMoney();

    String getTransactionCode();
}
