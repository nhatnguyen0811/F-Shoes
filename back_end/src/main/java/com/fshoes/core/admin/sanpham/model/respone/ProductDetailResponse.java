package com.fshoes.core.admin.sanpham.model.respone;

import com.fshoes.entity.base.IsIdentified;

import java.math.BigDecimal;

public interface ProductDetailResponse extends IsIdentified {

    String getStt();

    String getCode();

    String getColorName();

    String getBrand();

    String getCategory();

    String getSole();

    String getImage();

    String getMaterial();

    String getSize();

    String getColorCode();

    Integer getAmount();

    Integer getWeight();

    BigDecimal getPrice();

    Integer getDeleted();

    Integer getDeletedProduct();
}
