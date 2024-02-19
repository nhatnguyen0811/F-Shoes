package com.fshoes.core.admin.khuyenmai.model.request;

import com.fshoes.core.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ProductPromotionSearch extends PageableRequest {
    private String nameProduct;
}
