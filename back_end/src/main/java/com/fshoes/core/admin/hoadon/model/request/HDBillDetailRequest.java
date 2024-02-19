package com.fshoes.core.admin.hoadon.model.request;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HDBillDetailRequest {

    private String productDetailId;

    private String idBill;

    private Integer quantity;

    private BigDecimal price;

    private Integer status;

    private String note;

}
