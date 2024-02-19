package com.fshoes.core.admin.hoadon.service.impl;

import com.fshoes.core.admin.hoadon.model.request.HDBillHistoryRequest;
import com.fshoes.core.admin.hoadon.model.respone.HDBillHistoryResponse;
import com.fshoes.core.admin.hoadon.repository.HDBillHistoryRepository;
import com.fshoes.core.admin.hoadon.service.HDBillHistoryService;
import com.fshoes.core.common.UserLogin;
import com.fshoes.entity.BillHistory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HDBillHistoryServiceImpl implements HDBillHistoryService {

    @Autowired
    private HDBillHistoryRepository hdBillHistoryRepository;

    @Autowired
    private UserLogin userLogin;


    @Override
    public List<HDBillHistoryResponse> getListBillHistoryByIdBill(String idBill) {
        return hdBillHistoryRepository.getListBillHistoryByIdBill(idBill);
    }

    @Override
    public BillHistory save(HDBillHistoryRequest hdBillHistoryRequest) {
        if (hdBillHistoryRequest.getIdStaff() != null) {
            BillHistory billHistory = new BillHistory();
            billHistory.setBill(hdBillHistoryRequest.getBill());
            billHistory.setNote(hdBillHistoryRequest.getNote());
            billHistory.setStatusBill(hdBillHistoryRequest.getBill().getStatus());
            billHistory.setAccount(userLogin.getUserLogin());
            return hdBillHistoryRepository.save(billHistory);
        } else {
            BillHistory billHistory = new BillHistory();
            billHistory.setBill(hdBillHistoryRequest.getBill());
            billHistory.setNote(hdBillHistoryRequest.getNote());
            billHistory.setStatusBill(hdBillHistoryRequest.getBill().getStatus());
            billHistory.setAccount(null);
            return hdBillHistoryRepository.save(billHistory);
        }

    }

}
