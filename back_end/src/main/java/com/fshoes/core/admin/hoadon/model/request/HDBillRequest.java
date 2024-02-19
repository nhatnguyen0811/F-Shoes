package com.fshoes.core.admin.hoadon.model.request;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HDBillRequest {

    private String idVoucher;

    private String idCustomer;

    private String fullName;

    private String phoneNumber;

    private String address;

    private String note;

    private Integer status;

    private String noteBillHistory;

    private String idStaff;

    private String receiveDate;

    private String completeDate;

    private String confirmationDate;

    private String shipDate;

    private BigDecimal moneyShip;

    private Long desiredReceiptDate;

    private BigDecimal moneyReducer;
}
