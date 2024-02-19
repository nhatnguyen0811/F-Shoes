package com.fshoes.core.app;

import com.fshoes.core.admin.sell.model.request.CreateBillRequest;
import com.fshoes.core.admin.sell.service.AdminSellService;
import com.fshoes.core.common.ObjectRespone;
import com.fshoes.entity.Account;
import com.fshoes.entity.Bill;
import com.fshoes.infrastructure.constant.StatusBill;
import com.fshoes.infrastructure.exception.RestApiException;
import com.fshoes.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/app")
public class AppController {

    @Autowired
    private AppBillOrderRepository billOrderRepository;

    @Autowired
    private AdminSellService getSell;
    
    @GetMapping("/get-order/{text}")
    public ObjectRespone getBillOrder(@PathVariable("text") String text) {
        return new ObjectRespone(billOrderRepository.findBillApp(text));
    }

    @GetMapping("/get-product-detail-bill/{id}")
    public ObjectRespone getAllProductDetailBill(@PathVariable String id) {
        return new ObjectRespone(getSell.getProductDetailBillSell(id));
    }

    @PutMapping("/increase-quantity-bill-detail")
    public ObjectRespone increaseQuantityBillDetail(@RequestParam("idBillDetail") String idBillDetail, @RequestParam("idPrDetail") String idPrDetail) {
        return new ObjectRespone(getSell.increaseQuantityBillDetail(idBillDetail, idPrDetail));
    }

    @PutMapping("/decrease-quantity-bill-detail")
    public ObjectRespone decreaseQuantityBillDetail(@RequestParam("idBillDetail") String idBillDetail, @RequestParam("idPrDetail") String idPrDetail) {
        return new ObjectRespone(getSell.decreaseQuantityBillDetail(idBillDetail, idPrDetail));
    }

    @PutMapping("/roll-back-quantity-product-detail")
    public ObjectRespone rollBackQuantityProductDetail(@RequestParam("idBill") String idBill, @RequestParam("idPrDetail") String idPrDetail) {
        return new ObjectRespone(getSell.rollBackQuantityProductDetail(idBill, idPrDetail));
    }

    @PostMapping("/add-product-sell/{id}")
    public ObjectRespone addProductSell(@RequestBody CreateBillRequest request, @PathVariable String id) {
        return new ObjectRespone(getSell.addBillDetail(request, id));
    }

    @PutMapping("/input-quantity-bill-detail")
    public ObjectRespone inputQuantityBillDetail(@RequestParam("idBillDetail") String idBillDetail, @RequestParam("idPrDetail") String idPrDetail, @RequestParam("quantity") Integer quantity) {
        return new ObjectRespone(getSell.inputQuantityBillDetail(idBillDetail, idPrDetail, quantity));
    }
}
