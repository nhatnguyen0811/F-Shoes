package com.fshoes.core.admin.sell.model.request;

import com.fshoes.core.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdCustomerRequest extends PageableRequest {
    private String nameSearch;
    private Boolean gender;
    private Integer statusSearch;
}
