package com.fshoes.core.admin.sell.model.response;

import com.fshoes.entity.base.IsIdentified;

public interface GetAmountProductResponse extends IsIdentified {

    Integer getAmount();

    String getNameProduct();

    Integer getStatusPromotion();

    Double getPrice();

    Integer getWeight();

    Integer getSize();

    String getPromotion();

    Integer getValue();

    String getMaterial();

    String getCategory();

    String getSole();

    String getColor();

    String getBrand();

}
