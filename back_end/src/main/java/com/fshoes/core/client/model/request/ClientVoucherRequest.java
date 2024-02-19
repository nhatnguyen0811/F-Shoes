package com.fshoes.core.client.model.request;

import com.fshoes.core.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ClientVoucherRequest extends PageableRequest {
    private String idCustomer;
    private BigDecimal condition;
}
