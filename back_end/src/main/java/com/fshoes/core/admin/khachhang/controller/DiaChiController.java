package com.fshoes.core.admin.khachhang.controller;


import com.fshoes.core.admin.khachhang.model.request.DiaChiRequest;
import com.fshoes.core.admin.khachhang.service.DiaChiService;
import com.fshoes.core.common.ObjectRespone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/admin/dia-chi")
public class DiaChiController {
    @Autowired
    private DiaChiService diaChiService;

    @GetMapping("/get-all")
    public ObjectRespone getAllByIdCustomer(@RequestParam(defaultValue = "0") int p, @RequestParam String idCustomer) {
        return new ObjectRespone(diaChiService.getAllAddressByIdCustomer(p, idCustomer));
    }

    @GetMapping("/get-page")
    public ObjectRespone getPage(@RequestParam(defaultValue = "0") int p) {
        return new ObjectRespone(diaChiService.getPage(p));
    }

    @GetMapping("/get-one/{id}")
    public ObjectRespone getOne(@PathVariable String id) {
        return new ObjectRespone(diaChiService.getOne(id));
    }


    @PostMapping("/create")
    public ObjectRespone add(@RequestBody DiaChiRequest diaChiRequest) {
        return new ObjectRespone(diaChiService.add(diaChiRequest));
    }

    @PutMapping("/update/{id}")
    public ObjectRespone update(@PathVariable String id, @RequestBody DiaChiRequest diaChiRequest) {
        return new ObjectRespone(diaChiService.update(id, diaChiRequest));
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable String id) {
        diaChiService.delete(id);
    }

    @PutMapping("/status")
    public ObjectRespone updateStatus(@RequestParam String id, @RequestParam String idCustomer) {
        return new ObjectRespone(diaChiService.updateDefault(idCustomer, id));
    }

    @GetMapping("/get-default")
    public ObjectRespone getAddressDefault(@RequestParam String idCustomer) {
        return new ObjectRespone(diaChiService.getAddressDefault(idCustomer));
    }
}
