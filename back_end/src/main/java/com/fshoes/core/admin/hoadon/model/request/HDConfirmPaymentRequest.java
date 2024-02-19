package com.fshoes.core.admin.hoadon.model.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HDConfirmPaymentRequest extends HDBillRequest {

    private Integer type;

    private Integer paymentMethod;

    private BigDecimal paymentAmount;

    private String transactionCode;

}
