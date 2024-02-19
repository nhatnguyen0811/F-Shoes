package com.fshoes.core.client.model.response;

import com.fshoes.entity.base.IsIdentified;

public interface ClientPromotionResponse extends IsIdentified {

    String getStatus();

    String getValue();

    String getIdProductDetail();

    String getPrice();

    Integer getAmount();
}
