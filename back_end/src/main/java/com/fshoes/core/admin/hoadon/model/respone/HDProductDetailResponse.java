package com.fshoes.core.admin.hoadon.model.respone;

import com.fshoes.entity.base.IsIdentified;

import java.math.BigDecimal;

public interface HDProductDetailResponse extends IsIdentified {
    Integer getValue();

    BigDecimal getPrice();

}
