package com.fshoes.core.admin.hoadon.model.request;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class HdBillChangeMoneyResquest {
    private String idVoucher;

    private BigDecimal moneyReducer;

    private BigDecimal moneyAfter;
}
