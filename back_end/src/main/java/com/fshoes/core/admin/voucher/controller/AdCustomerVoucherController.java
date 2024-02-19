package com.fshoes.core.admin.voucher.controller;

import com.fshoes.core.admin.voucher.model.request.AdCustomerVoucherRequest;
import com.fshoes.core.admin.voucher.service.AdCustomerVoucherService;
import com.fshoes.core.common.ObjectRespone;
import com.fshoes.core.common.PageableRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/customerVoucher")
public class AdCustomerVoucherController {
    @Autowired
    private AdCustomerVoucherService adCustomerVoucherService;

    @GetMapping("/view/all")
    public ObjectRespone getAllCustomerVoucher() {
        return new ObjectRespone(adCustomerVoucherService.getAllCustomerVoucher());
    }

    @GetMapping("/view/one/{id}")
    public ObjectRespone getCustomerVoucherOneById(@PathVariable String id) {
        return new ObjectRespone(adCustomerVoucherService.getCustomerVoucherById(id));
    }

    @GetMapping("/view/page")
    public ObjectRespone getPageCustomerVoucher(@ModelAttribute PageableRequest pageableRequest) {
        return new ObjectRespone(adCustomerVoucherService.getPageCustomerVoucher(pageableRequest));
    }

    @PostMapping("/add")
    public ObjectRespone addCustomerVoucher(@RequestBody @Valid AdCustomerVoucherRequest adCustomerVoucherRequest) {
        return new ObjectRespone(adCustomerVoucherService.addCustomerVoucher(adCustomerVoucherRequest));
    }

    @DeleteMapping("/delete/{id}")
    public ObjectRespone deleteVoucher(@PathVariable String id) {
        return adCustomerVoucherService.deleteCustomerVoucher(id) ?
                new ObjectRespone("Hủy customer voucher thành công") :
                new ObjectRespone("Hủy customer voucher thất bại");
    }

    @GetMapping("/view/list-id-customer/{idVoucher}")
    public ObjectRespone getIdCustomerByIdVoucher(@PathVariable String idVoucher) {
        return new ObjectRespone(adCustomerVoucherService.getIdCustomerByIdVoucher(idVoucher));
    }
}
