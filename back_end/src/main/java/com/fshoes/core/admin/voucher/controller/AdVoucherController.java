package com.fshoes.core.admin.voucher.controller;

import com.fshoes.core.admin.voucher.model.request.AdCallVoucherOfSell;
import com.fshoes.core.admin.voucher.model.request.AdFindCustomerVoucherRequest;
import com.fshoes.core.admin.voucher.model.request.AdVoucherRequest;
import com.fshoes.core.admin.voucher.model.request.AdVoucherSearch;
import com.fshoes.core.admin.voucher.service.AdVoucherService;
import com.fshoes.core.common.ObjectRespone;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping("/api/admin/voucher")
public class AdVoucherController {

    @Autowired
    private AdVoucherService voucherService;

    @GetMapping("/view/all")
    public ObjectRespone getAllVoucher() {
        return new ObjectRespone(voucherService.getAllVoucher());
    }

    @GetMapping("/view/all-customer")
    public ObjectRespone getAllCustomer() {
        return new ObjectRespone(voucherService.getAllCustomer());
    }

    @GetMapping("/view/one/{id}")
    public ObjectRespone getOneVoucherById(@PathVariable String id) {
        return new ObjectRespone(voucherService.getVoucherById(id));
    }

    @GetMapping("/view/page")
    public ObjectRespone getPageVoucher(@RequestParam(name = "numberPage") Integer page) {
        return new ObjectRespone(voucherService.getPageVoucher(page));
    }

    @GetMapping("/view/all/customer")
    public ObjectRespone getFindAllCustomer(@ModelAttribute AdFindCustomerVoucherRequest request) {
        return new ObjectRespone(voucherService.getFindAllCustomer(request));
    }

    @GetMapping("/view/voucher-by-customer")
    public ObjectRespone getAllVoucherByIdCustomer(@ModelAttribute AdCallVoucherOfSell adCallVoucherOfSell) {
        return new ObjectRespone(voucherService.getAllVoucherByIdCustomer(adCallVoucherOfSell));
    }

    @PostMapping("/add")
    public ObjectRespone addVoucher(@RequestBody @Valid AdVoucherRequest voucherRequest) {
        return new ObjectRespone(voucherService.addVoucher(voucherRequest));
    }

    @PutMapping("/update/{id}")
    public ObjectRespone updateVoucher(@PathVariable String id, @RequestBody @Valid AdVoucherRequest voucherRequest) throws ParseException {
        return new ObjectRespone(voucherService.updateVoucher(id, voucherRequest));
    }

    @DeleteMapping("/delete/{id}")
    public ObjectRespone deleteVoucher(@PathVariable String id) throws ParseException {
        return voucherService.deleteVoucher(id) ?
                new ObjectRespone("Hủy voucher thành công") :
                new ObjectRespone("Hủy voucher thất bại");
    }

    @GetMapping("/search")
    public ObjectRespone getSearchVoucher(
            @ModelAttribute AdVoucherSearch adVoucherSearch) {
        return new ObjectRespone(voucherService.getSearchVoucher(adVoucherSearch));
    }

    @GetMapping("/view/code-voucher")
    public ObjectRespone getAllCodeVoucher() {
        return new ObjectRespone(voucherService.getAllCodeVoucher());
    }

    @GetMapping("/view/name-voucher")
    public ObjectRespone getAllNameVoucher() {
        return new ObjectRespone(voucherService.getAllCodeVoucher());
    }
}
