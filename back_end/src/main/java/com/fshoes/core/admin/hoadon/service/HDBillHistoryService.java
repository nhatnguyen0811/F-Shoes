package com.fshoes.core.admin.hoadon.service;

import com.fshoes.core.admin.hoadon.model.request.HDBillHistoryRequest;
import com.fshoes.core.admin.hoadon.model.respone.HDBillHistoryResponse;
import com.fshoes.entity.BillHistory;

import java.util.List;

public interface HDBillHistoryService {
    List<HDBillHistoryResponse> getListBillHistoryByIdBill(String idBill);

    BillHistory save(HDBillHistoryRequest hdBillHistoryRequest);

}
