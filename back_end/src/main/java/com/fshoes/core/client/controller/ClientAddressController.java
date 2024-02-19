package com.fshoes.core.client.controller;

import com.fshoes.core.client.model.request.ClientAddressRequest;
import com.fshoes.core.client.service.ClientAddressService;
import com.fshoes.core.common.ObjectRespone;
import com.fshoes.core.common.UserLogin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/client/address")
public class ClientAddressController {
    @Autowired
    private ClientAddressService service;

    @Autowired
    private UserLogin userLogin;

    @GetMapping("/get-all")
    public ObjectRespone getPageAddressByIdCustomer(@RequestParam(defaultValue = "0") int p) {
        return new ObjectRespone(service.getPageAddressByIdCustomer(p, userLogin));
    }

    @GetMapping("/get-default")
    public ObjectRespone getAddressDefault() {
        return new ObjectRespone(service.getAddressDefault(userLogin));
    }

    @GetMapping("/get-one/{id}")
    public ObjectRespone getOne(@PathVariable String id) {
        return new ObjectRespone(service.getOne(id));
    }


    @PostMapping("/create")
    public ObjectRespone add(@RequestBody ClientAddressRequest request) {
        return new ObjectRespone(service.add(request, userLogin));
    }

    @PutMapping("/update/{id}")
    public ObjectRespone update(@PathVariable String id, @RequestBody ClientAddressRequest request) {
        return new ObjectRespone(service.update(id, request));
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    @PutMapping("/status")
    public ObjectRespone updateStatus(@RequestParam String id) {
        return new ObjectRespone(service.updateDefault(userLogin, id));
    }
}
