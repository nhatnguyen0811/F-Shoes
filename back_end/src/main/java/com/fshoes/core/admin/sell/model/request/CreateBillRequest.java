package com.fshoes.core.admin.sell.model.request;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CreateBillRequest {

    private String productDetailId;

    private String billId;

    private Integer quantity;

    private BigDecimal price;

}
