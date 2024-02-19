package com.fshoes.core.client.model.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClientAddCartRequest {
    private String idProduct;
    private Integer amount;
}
