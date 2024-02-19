package com.fshoes.core.admin.sell.model.response;

import com.fshoes.entity.base.IsIdentified;

public interface CartDetailResponse extends IsIdentified {

    String getProductDetail();

    String getCart();

    Integer getQuantity();
}
