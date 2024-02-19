package com.fshoes.core.admin.sell.controller;

import com.fshoes.core.admin.sell.model.request.*;
import com.fshoes.core.admin.sell.service.AdminSellService;
import com.fshoes.core.admin.voucher.model.request.AdCallVoucherOfSell;
import com.fshoes.core.admin.voucher.service.AdVoucherService;
import com.fshoes.core.authentication.model.response.UserLoginResponse;
import com.fshoes.core.common.ObjectRespone;
import com.fshoes.core.common.UserLogin;
import com.fshoes.entity.Account;
import com.fshoes.entity.Bill;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/sell")
public class SellController {

    @Autowired
    private AdminSellService getSell;

    @Autowired
    private AdVoucherService voucherService;

    @Autowired
    private UserLogin userLogin;

    @GetMapping("/get-all-bill-tao-don-hang")
    public ObjectRespone getAllBillTaoDonHang() {
        Account account = userLogin.getUserLogin();
        if (account != null) {
            String email = account.getEmail();
            List<Bill> allBills = getSell.getAllBillTaoDonHang();
            List<Bill> filteredBills = allBills.stream()
                    .filter(bill -> bill.getCreatedBy().equals(email))
                    .collect(Collectors.toList());
            return new ObjectRespone(filteredBills);
        } else {
            return new ObjectRespone("Không có người dùng đăng nhập hoặc không tìm thấy tài khoản.");
        }
    }

    @GetMapping("/getProduct")
    public ObjectRespone getAllProduct(FilterProductDetailRequest request) {
        return new ObjectRespone(getSell.getAllProduct(request));
    }

    @GetMapping("/get-min-max-price")
    public ObjectRespone getMinMaxPrice() {
        return new ObjectRespone(getSell.getMinMaxPrice());
    }

    @GetMapping("/get-product/{id}")
    public ObjectRespone getAllProduct(@PathVariable String id) {
        return new ObjectRespone(getSell.getProduct(id));
    }

    @GetMapping("/get-size")
    public ObjectRespone getAllSize() {
        return new ObjectRespone(getSell.getListSize());
    }

    @GetMapping("/get-color")
    public ObjectRespone getAllColor() {
        return new ObjectRespone(getSell.getListColor());
    }

    @GetMapping("/get-amount/{id}")
    public ObjectRespone getAmount(@PathVariable String id) {
        return new ObjectRespone(getSell.getAmount(id));
    }

    @GetMapping("/get-pay_order/{idBill}")
    public ObjectRespone getPayOrder(@PathVariable String idBill) {
        return new ObjectRespone(getSell.getPayOrder(idBill));
    }

    @GetMapping("/get-total-money-pay_order/{idBill}")
    public ObjectRespone getTotalMoneyPayOrder(@PathVariable String idBill) {
        return new ObjectRespone(getSell.getTotalMoneyPayOrder(idBill));
    }

    @GetMapping("/get-product-detail-bill/{id}")
    public ObjectRespone getAllProductDetailBill(@PathVariable String id) {
        return new ObjectRespone(getSell.getProductDetailBillSell(id));
    }

    @PostMapping("/create-bill")
    public ObjectRespone createBillSell() {
        return new ObjectRespone(getSell.createBill());
    }

    @DeleteMapping("/delete-bill/{id}")
    public ObjectRespone deleteBillSell(@PathVariable String id) {
        return new ObjectRespone(getSell.deleteBill(id));
    }

    @DeleteMapping("/delete-transaction/{idBill}")
    public ObjectRespone deleteTransaction(@PathVariable String idBill) {
        return new ObjectRespone(getSell.deleteTransaction(idBill));
    }

    @GetMapping("/get-product-cart")
    public ObjectRespone getAllProductCart() {
        return new ObjectRespone(getSell.getAllProductCart());
    }

    @GetMapping("/get-one-bill")
    public ObjectRespone getOneBillById(@RequestParam String idBill){
        return new ObjectRespone(getSell.getOneBillByIdBill(idBill));
    }
    @GetMapping("/getCustomer")
    public ObjectRespone getAllCustomer(AdCustomerRequest request) {

        return new ObjectRespone(getSell.getAllCustomer(request));
    }

    @PostMapping("/add-product-sell/{id}")
    public ObjectRespone addProductSell(@RequestBody CreateBillRequest request, @PathVariable String id) {
        return new ObjectRespone(getSell.addBillDetail(request, id));
    }

    @PostMapping("/add-product-sell-by-id/{id}")
    public ObjectRespone addProductSellByIdProductDetail(@RequestParam String idProductDetail, @PathVariable String id) {
        return new ObjectRespone(getSell.addBillDetailByIdProduct(idProductDetail, id));
    }

    @PutMapping("/add-bill/{id}")
    public ObjectRespone addBill(@RequestBody AddBillRequest request, @PathVariable String id) {
        return new ObjectRespone(getSell.addBill(request, id));
    }

    @PutMapping("/add-address-bill/{id}")
    public ObjectRespone addAddressBill(@RequestBody AdAddressBillRequest request, @PathVariable String id) {
        return new ObjectRespone(getSell.addAdressBill(request, id));
    }

    @PutMapping("/pay-order/{id}")
    public ObjectRespone payOrder(@RequestBody AddBillRequest request, @PathVariable String id) {
        return new ObjectRespone(getSell.PayOrder(request, id));
    }

    @PutMapping("/update-quantity-product-detail/{id}")
    public ObjectRespone updateQuantityProductDetail(@PathVariable String id, @RequestParam("quantity") Integer quantity) {
        return new ObjectRespone(getSell.updateQuantityProductDetail(id, quantity));
    }

    @PutMapping("/roll-back-quantity-product-detail")
    public ObjectRespone rollBackQuantityProductDetail(@RequestParam("idBill") String idBill, @RequestParam("idPrDetail") String idPrDetail) {
        return new ObjectRespone(getSell.rollBackQuantityProductDetail(idBill, idPrDetail));
    }

    @DeleteMapping("/delete-product-detail-by-bill")
    public ObjectRespone deleteProductDetailByBill(@RequestParam("idBill") String idBill, @RequestParam("idPrDetail") List<String> idPrDetail) {
        return new ObjectRespone(getSell.deleteProductsDetail(idBill, idPrDetail));
    }


    @PutMapping("/input-quantity-bill-detail")
    public ObjectRespone inputQuantityBillDetail(@RequestParam("idBillDetail") String idBillDetail, @RequestParam("idPrDetail") String idPrDetail, @RequestParam("quantity") Integer quantity) {
        return new ObjectRespone(getSell.inputQuantityBillDetail(idBillDetail, idPrDetail, quantity));
    }

    @PutMapping("/increase-quantity-bill-detail")
    public ObjectRespone increaseQuantityBillDetail(@RequestParam("idBillDetail") String idBillDetail, @RequestParam("idPrDetail") String idPrDetail) {
        return new ObjectRespone(getSell.increaseQuantityBillDetail(idBillDetail, idPrDetail));
    }

    @PutMapping("/decrease-quantity-bill-detail")
    public ObjectRespone decreaseQuantityBillDetail(@RequestParam("idBillDetail") String idBillDetail, @RequestParam("idPrDetail") String idPrDetail) {
        return new ObjectRespone(getSell.decreaseQuantityBillDetail(idBillDetail, idPrDetail));
    }

    @GetMapping("/max-price")
    public ObjectRespone nameById() {
        return new ObjectRespone(getSell.getMaxPriceProductId());
    }

    @GetMapping("/view/voucher-by-customer")
    public ObjectRespone getAllVoucherByIdCustomer(@ModelAttribute AdCallVoucherOfSell adCallVoucherOfSell) {
        return new ObjectRespone(voucherService.getAllVoucherByIdCustomer(adCallVoucherOfSell));
    }

    @GetMapping("/view/list/voucher-by-customer")
    public ObjectRespone getListVoucherByIdCustomer(@ModelAttribute AdCallVoucherOfSell adCallVoucherOfSell) {
        return new ObjectRespone(voucherService.getListVoucherByIdCustomer(adCallVoucherOfSell));
    }

    @GetMapping("/view/list/voucher-by-customer-unqualified")
    public ObjectRespone getListVoucherByIdCustomerUnqualified(@ModelAttribute AdCallVoucherOfSell adCallVoucherOfSell) {
        return new ObjectRespone(voucherService.getListVoucherByIdCustomerUnqualified(adCallVoucherOfSell));
    }

    @GetMapping("/view/one/voucher/{id}")
    public ObjectRespone getOneVoucherById(@PathVariable String id) {
        return new ObjectRespone(voucherService.getVoucherById(id));
    }

    @GetMapping
    public ObjectRespone getUserLogin() {
        Account account = userLogin.getUserLogin();
        UserLoginResponse response = null;
        if (account != null) {
            response = new UserLoginResponse();
            response.setEmail(account.getEmail());
            response.setName(account.getFullName());
            response.setAvatar(account.getAvatar());
        }
        return new ObjectRespone(response);
    }
}
