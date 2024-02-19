package com.fshoes.core.client.controller;

import com.fshoes.core.admin.hoadon.service.HDBillHistoryService;
import com.fshoes.core.admin.sanpham.service.*;
import com.fshoes.core.admin.sell.model.request.FilterProductDetailRequest;
import com.fshoes.core.admin.sell.service.AdminSellService;
import com.fshoes.core.client.model.request.*;
import com.fshoes.core.client.model.response.ClientCustomerResponse;
import com.fshoes.core.client.service.ClientAccountService;
import com.fshoes.core.common.ObjectRespone;
import com.fshoes.core.common.UserLogin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;

@RestController
@RequestMapping("/api/client/customer")
public class ClientAccountController {
    @Autowired
    private ClientAccountService service;

    @Autowired
    private UserLogin userLogin;

    @Autowired
    private BrandService brandService;

    @Autowired
    private MaterialService materialService;

    @Autowired
    private ColorService colorService;

    @Autowired
    private SoleService soleService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private SizeService sizeService;

    @Autowired
    private AdminSellService getSell;

    @Autowired
    private HDBillHistoryService hdBillHistoryService;

    @PutMapping("/update")
    public ObjectRespone UpdateUser(@ModelAttribute ClientAccountRequest request) throws ParseException {
        return new ObjectRespone(service.update(userLogin, request));
    }

    @GetMapping("/get-one")
    public ObjectRespone getOneUser() {
        return new ObjectRespone(service.getOneCustomerClient(userLogin));
    }

    @GetMapping("/get-all")
    public List<ClientCustomerResponse> getAllAccount() {
        return service.getAll();
    }


    @GetMapping("/all-bill")
    public ObjectRespone getAllBill(ClientBillAccountRequest status) {
        return new ObjectRespone(service.getALlBill(status));
    }

    @GetMapping("/all-bill-table")
    public ObjectRespone getAllBillTable(ClientBillAccountRequest status) {
        return new ObjectRespone(service.getALlBillTable(status));
    }

    @GetMapping("/all-bill-return")
    public ObjectRespone getAllBillReturn() {
        return new ObjectRespone(service.getALlBillReturn());
    }

    @GetMapping("/get-by-idBill/{idBill}")
    public ObjectRespone getByIdBill(@PathVariable("idBill") String idBill) {
        return new ObjectRespone(service.getBillDetailsByBillId(idBill));
    }

    @GetMapping("/get-bill-history-by-idBill/{idBill}")
    public ObjectRespone getBillHistoryByIdBill(@PathVariable("idBill") String idBill) {
        return new ObjectRespone(service.getListBillHistoryByIdBill(idBill));
    }

    @GetMapping("/get-transaction-by-idBill/{idBill}")
    public ObjectRespone getTransactionByIdBill(@PathVariable("idBill") String idBill) {
        return new ObjectRespone(service.getListTransactionByIdBill(idBill));
    }


    @GetMapping("/get-by-code/{code}")
    public ObjectRespone getByCode(@PathVariable("code") String code) {
        return new ObjectRespone(service.getBillDetailsByCode(code));
    }

    @GetMapping("/get-bill-history-by-code/{code}")
    public ObjectRespone getBillHistoryCode(@PathVariable("code") String code) {
        return new ObjectRespone(service.getListBillHistoryByCode(code));
    }

    @GetMapping("/get-client-billResponse/{id}")
    public ObjectRespone getClientBillResponse(@PathVariable("id") String id) {
        return new ObjectRespone(service.getClientBillResponse(id));
    }

    @PutMapping("/update-inf-bill/{id}")
    public ObjectRespone updateInfBill(@PathVariable("id") String idBill,
                                       @RequestBody ClientBillRequest clientBillRequest) {
        return new ObjectRespone(service.updateBill(idBill, clientBillRequest));
    }

    @PostMapping("/save-billDetail")
    public ObjectRespone save(@RequestBody ClientBillDetailRequest clientBillDetailRequest) {
        return new ObjectRespone(service.saveBillDetail(clientBillDetailRequest));
    }

    @DeleteMapping("/delete-billDetail/{id}")
    public ObjectRespone deleteBillDetail(@PathVariable("id") String idBillDetail) {
        return new ObjectRespone(service.delete(idBillDetail));
    }

    @PutMapping("/cancel-bill/{id}")
    public ObjectRespone cancelBill(@PathVariable("id") String idBill,
                                    @RequestBody ClientCancelBillRequest clientCancelBillRequest) {
        return new ObjectRespone(service.cancelBill(idBill, clientCancelBillRequest));
    }

    @GetMapping("/find-all-brand")
    public ObjectRespone findAll() {
        return new ObjectRespone(brandService.findAll());
    }

    @GetMapping("/get-list-material")
    public ObjectRespone getListMaterial() {
        return new ObjectRespone(materialService.getListMaterial());
    }

    @GetMapping("/find-all-color")
    public ObjectRespone findAllColor() {
        return new ObjectRespone(colorService.findAll());
    }

    @GetMapping("/find-all-sole")
    public ObjectRespone findAllSole() {
        return new ObjectRespone(soleService.findAll());
    }

    @GetMapping("/find-all-category")
    public ObjectRespone findAllCategory() {
        return new ObjectRespone(categoryService.findAll());
    }

    @GetMapping("/find-all-size")
    public ObjectRespone findAllSize() {
        return new ObjectRespone(sizeService.findAll());
    }

    @GetMapping("/getProduct")
    public ObjectRespone getAllProduct(FilterProductDetailRequest request) {
        return new ObjectRespone(getSell.getAllProduct(request));
    }

    @GetMapping("/get-billHistory-by-idBill/{idBill}")
    public ObjectRespone billHistoryByIdBill(@PathVariable("idBill") String idBill) {
        return new ObjectRespone(hdBillHistoryService.getListBillHistoryByIdBill(idBill));
    }

}
