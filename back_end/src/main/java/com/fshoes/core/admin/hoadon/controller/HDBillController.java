package com.fshoes.core.admin.hoadon.controller;

import com.fshoes.core.admin.hoadon.model.request.*;
import com.fshoes.core.admin.hoadon.service.HDBillService;
import com.fshoes.core.common.ObjectRespone;
import com.fshoes.core.common.PageReponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.text.ParseException;
import java.util.List;

@RestController
@RequestMapping("/api/admin/bill")
public class HDBillController {

    @Autowired
    private HDBillService hdBillService;

    @GetMapping("/filter")
    public PageReponse getBillByStatusAndDateRange(
            @ModelAttribute BillFilterRequest billFilterRequest
    ) throws ParseException {
        return new PageReponse<>(hdBillService.filterBill(billFilterRequest));
    }

    @PostMapping("/create-bill")
    public ObjectRespone createBill() {
        return new ObjectRespone(hdBillService.createBill());
    }

    @PutMapping("/update/{id}")
    public ObjectRespone updateBill(@PathVariable("id") String idBill,
                                    @RequestBody HDBillRequest hdBillRequest) {
        return new ObjectRespone(hdBillService.updateBill(idBill, hdBillRequest));
    }

    @PutMapping("/cancel/{id}")
    public ObjectRespone cancel(@PathVariable("id") String idBill,
                                @RequestBody HDBillRequest hdBillRequest) {
        return new ObjectRespone(hdBillService.cancelOrder(idBill, hdBillRequest));
    }

    @PutMapping("/confirm-order/{idBill}")
    public ObjectRespone confirmOrder(@PathVariable(name = "idBill") String idBill,
                                      @RequestBody BillConfirmRequest billConfirmRequest) {
        return new ObjectRespone(hdBillService.confirmOrder(idBill, billConfirmRequest));
    }

    @GetMapping("/get/{id}")
    public ObjectRespone getOne(@PathVariable("id") String id) {
        return new ObjectRespone(hdBillService.getOne(id));
    }

    @GetMapping("/check-bill-exist/{id}")
    public ObjectRespone isCheckBillExist(@PathVariable("id") String id) {
        return new ObjectRespone(hdBillService.isCheckBillExist(id));
    }

    @PutMapping("/update-status/{id}")
    public ObjectRespone updateStatus(@PathVariable("id") String id, @RequestBody HDBillRequest hdBillRequest) {
        return new ObjectRespone(hdBillService.updateStatusBill(id, hdBillRequest));
    }

    @PutMapping("/confirm-payment/{id}")
    public ObjectRespone confirmPayment(@PathVariable("id") String id, @RequestBody HDConfirmPaymentRequest hdConfirmPaymentRequest) {
        return new ObjectRespone(hdBillService.confirmPayment(id, hdConfirmPaymentRequest));
    }

    @PutMapping("/update-billDetail/{id}")
    public ObjectRespone updateBillDetail(@PathVariable("id") String id, @RequestBody List<HDBillDetailRequest> listHdBillDetailRequest) {
        return new ObjectRespone(hdBillService.updateBillDetailByBill(id, listHdBillDetailRequest));
    }

    @PostMapping("/print-bill/{id}")
    public ObjectRespone inHoaDon(@PathVariable("id") String id) {
        File file = hdBillService.xuatHoaDon(id);
        return new ObjectRespone(file);
    }

    @PutMapping("/return-stt/{id}")
    public ObjectRespone returnSttBill(@PathVariable("id") String id, @RequestBody HDBillRequest hdBillRequest) {
        return new ObjectRespone(hdBillService.returnSttBill(id, hdBillRequest));
    }

    @GetMapping("/get-list-staff/{id}")
    public ObjectRespone getListNhanVien(@PathVariable("id") String id, @ModelAttribute HDNhanVienSearchRequest hdNhanVienSearchRequest) {
        return new ObjectRespone(hdBillService.getListNhanVien(id, hdNhanVienSearchRequest));
    }

    @PutMapping("/add-staff-reception-bill/{idBill}/{idAcc}")
    public ObjectRespone returnSttBill(@PathVariable("idBill") String idBill, @PathVariable("idAcc") String idAcc) {
        return new ObjectRespone(hdBillService.themNhanVienTiepNhan(idBill, idAcc));
    }

    @PutMapping("/capNhatPhiShip/{idBill}")
    public ObjectRespone capNhatPhiShip(@PathVariable("idBill") String idBill, @RequestParam String phiShip) {
        return new ObjectRespone(hdBillService.capNhatPhiShip(idBill, phiShip));
    }

    @PutMapping("/change-money-bill/{idBill}")
    public ObjectRespone changeMoneyBill(@PathVariable String idBill, @RequestBody HdBillChangeMoneyResquest resquest) {
        return new ObjectRespone(hdBillService.changeMoneyBill(idBill, resquest));
    }
}
