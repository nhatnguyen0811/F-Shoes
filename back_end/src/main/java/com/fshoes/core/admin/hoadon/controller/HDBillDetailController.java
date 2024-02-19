package com.fshoes.core.admin.hoadon.controller;

import com.fshoes.core.admin.hoadon.model.request.HDBillDetailRequest;
import com.fshoes.core.admin.hoadon.service.HDBillDetailService;
import com.fshoes.core.admin.hoadon.service.HDProductDetailService;
import com.fshoes.core.common.ObjectRespone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/billDetail")
public class HDBillDetailController {

    @Autowired
    private HDBillDetailService hdBillDetailService;

    @Autowired
    private HDProductDetailService hdBillDetailServic;

    @GetMapping("/get-by-idBill/{idBill}")
    public ObjectRespone getByIdBill(@PathVariable("idBill") String idBill) {
        return new ObjectRespone(hdBillDetailService.getBillDetailByBillId(idBill));
    }

    @PostMapping("/save")
    public ObjectRespone save(@RequestBody HDBillDetailRequest hdBillDetailRequest) {
        return new ObjectRespone(hdBillDetailService.save(hdBillDetailRequest));
    }

    @PutMapping("/update/{id}")
    public ObjectRespone updateBilldetail(@PathVariable("id") String id,
                                          @RequestBody HDBillDetailRequest hdBillDetailRequest) {
        return new ObjectRespone(hdBillDetailService.updateBillDetail(id, hdBillDetailRequest));
    }

    @GetMapping("/get-by-billAndProductDetail")
    public ObjectRespone getByBillAndProductDetail(@RequestParam(name = "idBill") String idBill,
                                                   @RequestParam(name = "idPrd") String idPrd) {
        return new ObjectRespone(hdBillDetailService.getBillDtResByIdBillAndIDPrd(idBill, idPrd));
    }

    @PutMapping("/decrementQuantity/{idBillDetail}")
    public ObjectRespone decrementQuantity(@PathVariable("idBillDetail") String idBillDetail) {
        return new ObjectRespone(hdBillDetailService.decrementQuantity(idBillDetail));
    }

    @PutMapping("/incrementQuantity/{idBillDetail}")
    public ObjectRespone incrementQuantity(@PathVariable("idBillDetail") String idBillDetail) {
        return new ObjectRespone(hdBillDetailService.incrementQuantity(idBillDetail));
    }

    @PutMapping("/changeQuantity/{idBillDetail}")
    public ObjectRespone changeQuantity(@PathVariable("idBillDetail") String idBillDetail, @RequestBody Integer quantity) {
        return new ObjectRespone(hdBillDetailService.changeQuantity(idBillDetail, quantity));
    }

    @PutMapping("/delete/{id}")
    public Boolean delete(@PathVariable("id") String id) {
        return hdBillDetailService.delete(id);
    }

    @PutMapping("/return-product/{id}")
    public ObjectRespone returnProduct(@PathVariable("id") String id,
                                       @RequestBody HDBillDetailRequest hdBillDetailRequest) {
        return new ObjectRespone(hdBillDetailService.returnProduct(id, hdBillDetailRequest));
    }

    @GetMapping("/get-by-billAndProductDetailAndPrice")
    public ObjectRespone checkBillDetailByBillPrdAndPrice(@RequestParam(name = "idBill") String idBill,
                                                          @RequestParam(name = "idPrd") String idPrd, @RequestParam(name = "price") String price) {
        return new ObjectRespone(hdBillDetailService.getBillDtResByIdBillAndIDPrdAndPrice(idBill, idPrd, price));
    }

    @GetMapping("/isCheckDonGiaVsPricePrd/{id}")
    public ObjectRespone isCheckDonGiaVsPricePrd(@PathVariable("id") String id) {
        return new ObjectRespone(hdBillDetailService.isCheckDonGiaVsPricePrd(id));
    }

    @GetMapping("/getHDPrdRes/{id}")
    public ObjectRespone getHDPrdRes(@PathVariable("id") String id) {
        return new ObjectRespone(hdBillDetailServic.getPrdVsMaxKMValue(id));
    }

    @GetMapping("/get/voucher/by/idBill/{id}")
    public ObjectRespone getVoucherByIdBill(@PathVariable("id") String id) {
        return new ObjectRespone(hdBillDetailService.getVoucherByIdBill(id));
    }

    @GetMapping("/get/percent/by/idBill/{id}")
    public ObjectRespone getPercentByIdBill(@PathVariable("id") String id) {
        return new ObjectRespone(hdBillDetailService.getPercentInBill(id));
    }

    @GetMapping("/view/one/voucher/{idBill}")
    public ObjectRespone getOneVoucherById(@PathVariable String idBill) {
        return new ObjectRespone(hdBillDetailService.getVoucherById(idBill));
    }
}
