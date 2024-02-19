package com.fshoes.core.admin.voucher.model.request;

import com.fshoes.entity.Account;
import com.fshoes.entity.CustomerVoucher;
import com.fshoes.entity.Voucher;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdCustomerVoucherRequest {
    private Account account;
    private Voucher voucher;

    public CustomerVoucher newCustomerVoucher(CustomerVoucher customerVoucher) {
        customerVoucher.setAccount(this.getAccount());
        customerVoucher.setVoucher(this.getVoucher());
        return customerVoucher;
    }
}
