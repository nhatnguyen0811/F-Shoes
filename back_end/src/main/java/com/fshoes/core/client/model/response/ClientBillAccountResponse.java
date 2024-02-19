package com.fshoes.core.client.model.response;

import com.fshoes.entity.base.IsIdentified;
import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;

public interface ClientBillAccountResponse extends IsIdentified {

    @Value("#{target.id_customer}")
    String getCustomer();

    String getNameProduct();

    String getCode();

    String getCategory();

    String getBrand();

    String getMaterial();

    Float getSize();

    Integer getQuantity();

    String getSole();

    String getColor();

    BigDecimal getPrice();

    String getUrl();


}
