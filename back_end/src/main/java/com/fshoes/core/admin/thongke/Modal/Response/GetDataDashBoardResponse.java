package com.fshoes.core.admin.thongke.Modal.Response;

import com.fshoes.entity.base.IsIdentified;

import java.math.BigDecimal;


public interface GetDataDashBoardResponse extends IsIdentified {

    BigDecimal getPrice();

    String getNameProduct();

    Integer getQuantity();

    String getImage();

    String getSize();

}
