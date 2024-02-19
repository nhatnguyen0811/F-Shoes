package com.fshoes.core.admin.sanpham.model.request;

import com.fshoes.core.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class BrandFilterRequest extends PageableRequest {
    private String name;
}
