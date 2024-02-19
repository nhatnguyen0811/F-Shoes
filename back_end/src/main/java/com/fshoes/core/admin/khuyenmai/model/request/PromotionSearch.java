package com.fshoes.core.admin.khuyenmai.model.request;

import com.fshoes.core.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PromotionSearch extends PageableRequest {

    private String name;

    private Long timeStart;

    private Long timeEnd;

    private Integer type;

    private Integer status;

}
