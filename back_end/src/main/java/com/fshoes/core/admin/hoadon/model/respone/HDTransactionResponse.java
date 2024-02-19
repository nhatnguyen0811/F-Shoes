package com.fshoes.core.admin.hoadon.model.respone;

import com.fshoes.entity.base.IsIdentified;

import java.math.BigDecimal;

public interface HDTransactionResponse extends IsIdentified {
    BigDecimal getTotalMoney();

    Integer getType();

    Integer getPaymentMethod();

    Integer getStatus();

    String getNote();

    String getFullName();

}
