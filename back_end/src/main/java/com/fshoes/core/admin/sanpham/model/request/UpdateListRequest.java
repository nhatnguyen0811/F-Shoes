package com.fshoes.core.admin.sanpham.model.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateListRequest {
    private String id;
    private Integer weight;
    private Integer amount;
    private Integer price;
}
