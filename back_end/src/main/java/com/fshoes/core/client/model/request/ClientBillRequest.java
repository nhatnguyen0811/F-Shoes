package com.fshoes.core.client.model.request;

import lombok.*;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString

public class ClientBillRequest {
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

}
