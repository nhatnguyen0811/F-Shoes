package com.fshoes.core.admin.sanpham.model.request;

import com.fshoes.core.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PrdDetailFilterRequest extends PageableRequest {

    private String product;

    private String name;

    private String color;

    private String material;

    private String sizeFilter;

    private String sole;

    private String category;

    private String brand;

    private Integer status;

    private BigDecimal priceMin;

    private BigDecimal priceMax;
}
