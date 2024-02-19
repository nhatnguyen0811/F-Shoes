package com.fshoes.core.client.model.response;

import com.fshoes.entity.base.IsIdentified;

import java.math.BigDecimal;

public interface ClientProfileBillDetailResponse extends IsIdentified {
    String getProductImg();

    String getProductName();

    BigDecimal getPrice();

    BigDecimal getProductPrice();

    Integer getSize();

    Integer getQuantity();

    String getProductDetailId();

    Integer getStatus();

    Integer getWeight();

    String getNote();
}
