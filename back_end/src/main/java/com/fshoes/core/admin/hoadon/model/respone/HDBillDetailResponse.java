package com.fshoes.core.admin.hoadon.model.respone;

import com.fshoes.entity.base.IsIdentified;

import java.math.BigDecimal;

public interface HDBillDetailResponse extends IsIdentified {

    String getIdBill();

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

    Integer receivingMethod();


}
