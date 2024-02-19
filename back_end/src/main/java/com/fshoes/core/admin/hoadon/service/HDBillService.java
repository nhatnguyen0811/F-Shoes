package com.fshoes.core.admin.hoadon.service;

import com.fshoes.core.admin.hoadon.model.request.*;
import com.fshoes.core.admin.hoadon.model.respone.HDBillResponse;
import com.fshoes.core.admin.hoadon.model.respone.HDNhanVienResponse;
import com.fshoes.entity.Bill;
import org.springframework.data.domain.Page;

import java.io.File;
import java.util.List;

public interface HDBillService {
    Page<HDBillResponse> filterBill(BillFilterRequest billFilterRequest);

    Bill createBill();

    Bill updateBill(String idBill, HDBillRequest hdBillRequest);

    Boolean cancelOrder(String idBill, HDBillRequest hdBillRequest);

    Bill confirmOrder(String idBill, BillConfirmRequest billConfirmRequest);

    HDBillResponse getOne(String id);

    Bill updateStatusBill(String idBill, HDBillRequest hdBillRequest);

    Bill confirmPayment(String idBill, HDConfirmPaymentRequest hdConfirmPaymentRequest);

    Bill updateBillDetailByBill(String idBill, List<HDBillDetailRequest> listHDBillRequest);

    File xuatHoaDon(String idBill);

    Boolean returnSttBill(String idBill, HDBillRequest hdBillRequest);

    HDBillResponse isCheckBillExist(String idBill);

    Page<HDNhanVienResponse> getListNhanVien(String idBill, HDNhanVienSearchRequest hdNhanVienSearchRequest);

    Boolean themNhanVienTiepNhan(String idAccount, String idBill);

    File xuatHoaDonGiaoHang(String idBill);

    Boolean capNhatPhiShip(String idBill, String phiShip);

    Bill changeMoneyBill(String idBill, HdBillChangeMoneyResquest resquest);

}
