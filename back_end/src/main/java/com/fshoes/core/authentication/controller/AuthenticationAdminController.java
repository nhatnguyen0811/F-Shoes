package com.fshoes.core.authentication.controller;

import com.fshoes.core.authentication.model.request.ChangeRequest;
import com.fshoes.core.authentication.service.AuthenticationService;
import com.fshoes.core.common.ObjectRespone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/authentication")
public class AuthenticationAdminController {
    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/doi-mat-khau")
    public ObjectRespone change(@RequestBody ChangeRequest request) {
        return new ObjectRespone(authenticationService.changePass(request));
    }
}
