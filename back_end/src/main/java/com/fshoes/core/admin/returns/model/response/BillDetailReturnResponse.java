package com.fshoes.core.admin.returns.model.response;

import com.fshoes.entity.base.IsIdentified;

import java.math.BigDecimal;

public interface BillDetailReturnResponse extends IsIdentified {

    String getImage();

    String getName();

    Integer getQuantity();

    BigDecimal getPrice();

    String getNote();
}
