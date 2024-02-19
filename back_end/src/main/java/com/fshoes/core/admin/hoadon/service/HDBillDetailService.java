package com.fshoes.core.admin.hoadon.service;

import com.fshoes.core.admin.hoadon.model.request.HDBillDetailRequest;
import com.fshoes.core.admin.hoadon.model.respone.HDBillDetailResponse;
import com.fshoes.core.admin.voucher.model.respone.AdVoucherRespone;
import com.fshoes.entity.BillDetail;

import java.math.BigDecimal;
import java.util.List;

public interface HDBillDetailService {
    Boolean save(HDBillDetailRequest hdBillDetailRequest);

    List<HDBillDetailResponse> getBillDetailByBillId(String idBill);

    BillDetail updateBillDetail(String idBillDetail, HDBillDetailRequest hdBillDetailRequest);

    BillDetail getBillDetailByBillIdAndProductDetailId(String idBill, String idProductDetail);

    BillDetail decrementQuantity(String idBillDetail);

    BillDetail incrementQuantity(String idBillDetail);

    BillDetail changeQuantity(String idBillDetail, Integer quantity);

    Boolean delete(String id);

    Boolean returnProduct(String idBillDetail, HDBillDetailRequest hdBillDetailRequest);

    List<HDBillDetailResponse> getBillDtResByIdBillAndIDPrd(String idBill, String idPrd);

    HDBillDetailResponse getBillDtResByIdBillAndIDPrdAndPrice(String idBill, String idPrd, String price);

    Boolean isCheckDonGiaVsPricePrd(String id);

    AdVoucherRespone getVoucherByIdBill(String idBill);

    BigDecimal getPercentInBill(String idBill);

    AdVoucherRespone getVoucherById(String id);
}
