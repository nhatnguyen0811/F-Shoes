package com.fshoes.core.client.controller;

import com.fshoes.core.client.model.request.ClientCheckoutRequest;
import com.fshoes.core.client.service.ClientCheckoutService;
import com.fshoes.core.common.ObjectRespone;
import com.fshoes.core.common.UserLogin;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/client/checkout")
public class ClientCheckOutController {

    @Autowired
    private ClientCheckoutService service;

    @Autowired
    private UserLogin userLogin;

    @PostMapping
    public ObjectRespone checkout(@RequestBody ClientCheckoutRequest request) {
        return new ObjectRespone(service.thanhToan(request, userLogin));
    }

    @PostMapping("/submitOrder")
    public String submitOrder(@RequestBody ClientCheckoutRequest request) {
        return service.createOrder(request, userLogin);
    }

    @GetMapping("/payment")
    public ObjectRespone GetMapping(HttpServletRequest request) {
        return new ObjectRespone(service.orderReturn(request));
    }
}
