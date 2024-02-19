package com.fshoes.core.admin.voucher.service;

import com.fshoes.core.admin.khachhang.model.respone.KhachHangRespone;
import com.fshoes.core.admin.voucher.model.request.AdCallVoucherOfSell;
import com.fshoes.core.admin.voucher.model.request.AdFindCustomerVoucherRequest;
import com.fshoes.core.admin.voucher.model.request.AdVoucherRequest;
import com.fshoes.core.admin.voucher.model.request.AdVoucherSearch;
import com.fshoes.core.admin.voucher.model.respone.AdFindCustomerRespone;
import com.fshoes.core.admin.voucher.model.respone.AdVoucherRespone;
import com.fshoes.entity.Voucher;
import org.springframework.data.domain.Page;

import java.text.ParseException;
import java.util.List;

public interface AdVoucherService {
    List<AdVoucherRespone> getAllVoucher();

    List<KhachHangRespone> getAllCustomer();

    AdVoucherRespone getVoucherById(String id);

    Page<AdVoucherRespone> getPageVoucher(Integer page);

    Page<AdFindCustomerRespone> getFindAllCustomer(AdFindCustomerVoucherRequest request);

    Voucher addVoucher(AdVoucherRequest voucherRequest);

    Voucher updateVoucher(String id, AdVoucherRequest voucherRequest) throws ParseException;

    Boolean deleteVoucher(String id) throws ParseException;

    List<String> getAllCodeVoucher();

    List<String> getAllNameVoucher();

    Page<AdVoucherRespone> getAllVoucherByIdCustomer(AdCallVoucherOfSell adCallVoucherOfSell);

    List<AdVoucherRespone> getListVoucherByIdCustomer(AdCallVoucherOfSell adCallVoucherOfSell);

    List<AdVoucherRespone> getListVoucherByIdCustomerUnqualified(AdCallVoucherOfSell adCallVoucherOfSell);

    Page<AdVoucherRespone> getSearchVoucher(AdVoucherSearch adVoucherSearch);
}
