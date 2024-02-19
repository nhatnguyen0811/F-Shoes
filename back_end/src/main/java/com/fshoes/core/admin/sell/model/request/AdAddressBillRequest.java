package com.fshoes.core.admin.sell.model.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AdAddressBillRequest {
    private String fullName;

    private String phoneNumber;

    private String address;

    private String idCustomer;

}
