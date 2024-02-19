package com.fshoes.core.client.model.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class ClientBillDetaillRequest {
    private String nameProduct;
    private String idProduct;
    private Integer quantity;
    private String price;
}
