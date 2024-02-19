package com.fshoes.core.admin.sell.model.response;

import com.fshoes.entity.base.IsIdentified;

public interface GetAllProductResponse extends IsIdentified {

    Integer getStatusPromotion();
    String getProductDetailId();

    String getName();

    Double getPrice();

    Integer getWeight();

    Integer getSize();

    String getUrl();

    Integer getAmount();


    Integer getValue();

    String getMaterial();

    String getCategory();

    String getSole();

    String getColor();

    String getBrand();

    String getCode();

}
