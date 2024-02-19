package com.fshoes.core.admin.sanpham.model.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class SizeFilterRequest {
    private String size;
    private Integer pageNumber = 1;
    private Integer pageSize = 5;
}
