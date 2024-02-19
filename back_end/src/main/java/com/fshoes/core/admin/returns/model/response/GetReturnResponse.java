package com.fshoes.core.admin.returns.model.response;

import com.fshoes.entity.base.IsIdentified;

import java.math.BigDecimal;

public interface GetReturnResponse extends IsIdentified {
    Integer getStt();

    String getCode();

    String getCodeBill();

    String getIdBill();

    Long getDate();

    BigDecimal getTotal();

    Integer getStatus();

}
