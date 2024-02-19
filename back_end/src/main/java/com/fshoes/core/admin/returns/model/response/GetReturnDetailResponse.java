package com.fshoes.core.admin.returns.model.response;

import com.fshoes.entity.base.IsIdentified;

import java.math.BigDecimal;

public interface GetReturnDetailResponse extends IsIdentified {
    String getCode();

    String getCodeBill();

    String getIdBill();

    String getCustomer();

    BigDecimal getTotal();

    Integer getFee();

    Integer getStatus();
    String getFullName();
    String getAddress();
}
