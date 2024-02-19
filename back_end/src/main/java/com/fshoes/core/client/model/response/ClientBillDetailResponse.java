package com.fshoes.core.client.model.response;

import com.fshoes.entity.base.IsIdentified;

import java.math.BigDecimal;

public interface ClientBillDetailResponse extends IsIdentified {

    String getIdBill();

    String getUrl();

    String getProductName();

    BigDecimal getPrice();

    BigDecimal getProductPrice();

    Integer getSize();

    Integer getQuantity();

    String getProductDetailId();

    Integer getStatus();

    Integer getWeight();

    String getCategory();

    String getBrand();

    String getMaterial();

    String getSole();

    String getColor();

    String getNameCustomer();

    String getPhoneNumberCustomer();

    String getAddress();

    String getTotalMoney();

    String getMoneyAfter();

    String getMoneyReduced();

    String getMoneyShip();
}
