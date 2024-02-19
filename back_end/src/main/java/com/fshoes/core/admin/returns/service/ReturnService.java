package com.fshoes.core.admin.returns.service;

import com.fshoes.core.admin.returns.model.request.GetBillRequest;
import com.fshoes.core.admin.returns.model.request.GetReturnRequest;
import com.fshoes.core.admin.returns.model.request.ReturnRequest;
import com.fshoes.core.admin.returns.model.response.BillDetailReturnResponse;
import com.fshoes.core.admin.returns.model.response.GetReturnDetailResponse;
import com.fshoes.core.admin.returns.model.response.GetReturnResponse;
import com.fshoes.core.common.PageReponse;
import com.fshoes.entity.Bill;

import java.util.List;

public interface ReturnService {

    String getBill(GetBillRequest request);

    Bill getBillId(String id);

    List<BillDetailReturnResponse> getBillDetail(String id);

    Boolean acceptReturn(ReturnRequest request);
}
