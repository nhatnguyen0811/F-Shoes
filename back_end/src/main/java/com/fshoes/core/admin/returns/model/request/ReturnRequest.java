package com.fshoes.core.admin.returns.model.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReturnRequest {
    List<ReturnDetailRequest> listDetail;
    private String idBill;
    private String returnMoney;
    private String moneyPayment;
}
