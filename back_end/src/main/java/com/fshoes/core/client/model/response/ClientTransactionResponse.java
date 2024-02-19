package com.fshoes.core.client.model.response;

import com.fshoes.entity.base.IsIdentified;

import java.math.BigDecimal;

public interface ClientTransactionResponse extends IsIdentified {
    BigDecimal getTotalMoney();

    Integer getType();

    Integer getPaymentMethod();

    Integer getStatus();

    String getNote();

    String getFullName();
}
