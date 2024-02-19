package com.fshoes.core.admin.hoadon.service;

import com.fshoes.core.admin.hoadon.model.respone.HDTransactionResponse;

import java.util.List;

public interface HDTransactionService {
    List<HDTransactionResponse> getTransactionByBillId(String idBill);
    
}
