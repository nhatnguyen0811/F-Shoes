package com.fshoes.core.client.model.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ClientProductDetailRequest {
    private String idProduct;
    private String idColor;
    private String idCategory;
    private String idBrand;
    private String idSole;
    private String idMaterial;
    private String idSize;
}
