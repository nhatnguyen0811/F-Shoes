package com.fshoes.core.admin.sanpham.model.respone;

import com.fshoes.entity.base.IsIdentified;

import java.math.BigDecimal;

public interface ProductMaxPriceResponse extends IsIdentified {
    BigDecimal getPrice();

    String getName();
}
