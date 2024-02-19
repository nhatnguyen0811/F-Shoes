package com.fshoes.core.client.model.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClientProductCungLoaiRequest {
    private String id;
    private String product;
    private String category;
    private String brand;
    private String color;
    private String sole;
    private String material;

}
