package com.fshoes.core.client.model.request;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientBillDetailRequest {
    private String productDetailId;

    private String idBill;

    private Integer quantity;

    private BigDecimal price;

    private Integer status;

}
