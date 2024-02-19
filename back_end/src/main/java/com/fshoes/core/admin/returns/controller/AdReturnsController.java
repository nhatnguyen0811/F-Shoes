package com.fshoes.core.admin.returns.controller;

import com.fshoes.core.admin.returns.model.request.GetBillRequest;
import com.fshoes.core.admin.returns.model.request.GetReturnRequest;
import com.fshoes.core.admin.returns.model.request.ReturnRequest;
import com.fshoes.core.admin.returns.service.ReturnService;
import com.fshoes.core.common.ObjectRespone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/returns")
public class AdReturnsController {

    @Autowired
    private ReturnService returnService;

    @GetMapping("/bill")
    public ObjectRespone getBill(GetBillRequest request) {
        return new ObjectRespone(returnService.getBill(request));
    }

    @GetMapping("/bill-id/{id}")
    public ObjectRespone getBillId(@PathVariable("id") String id) {
        return new ObjectRespone(returnService.getBillId(id));
    }

    @GetMapping("/bill-detail/{id}")
    public ObjectRespone getBillDetail(@PathVariable("id") String id) {
        return new ObjectRespone(returnService.getBillDetail(id));
    }

    @PostMapping("/accept")
    public ObjectRespone acceptReturn(@RequestBody ReturnRequest request) {
        return new ObjectRespone(returnService.acceptReturn(request));
    }
}
