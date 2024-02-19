package com.fshoes.core.admin.voucher.model.request;

import com.fshoes.core.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class AdCallVoucherOfSell extends PageableRequest {
    private String idCustomer;
    private BigDecimal condition;
    private String textSearch;
    private String typeSearch;
    private String typeValueSearch;
}
