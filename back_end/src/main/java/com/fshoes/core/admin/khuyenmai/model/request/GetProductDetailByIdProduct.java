package com.fshoes.core.admin.khuyenmai.model.request;

import com.fshoes.core.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetProductDetailByIdProduct extends PageableRequest {
    private String id;
    private String color;
    private String material;
    private String sole;
    private String category;
    private String brand;
    private String nameProduct;
}
