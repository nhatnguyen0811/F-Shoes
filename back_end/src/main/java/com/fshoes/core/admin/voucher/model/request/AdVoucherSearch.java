package com.fshoes.core.admin.voucher.model.request;

import com.fshoes.core.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class AdVoucherSearch extends PageableRequest {
    private String nameSearch;
    private Long startDateSearch;
    private Long endDateSearch;
    private Integer typeSearch;
    private Integer typeValueSearch;
    private Integer statusSearch;
}
