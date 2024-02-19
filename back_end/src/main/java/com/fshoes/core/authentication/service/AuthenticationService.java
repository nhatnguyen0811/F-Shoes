package com.fshoes.core.authentication.service;

import com.fshoes.core.authentication.model.request.ChangeRequest;
import com.fshoes.core.authentication.model.request.LoginGoogleRequest;
import com.fshoes.core.authentication.model.request.LoginRequest;
import com.fshoes.core.authentication.model.request.RegisterRequest;
import com.fshoes.core.authentication.model.response.UserLoginResponse;
import com.fshoes.entity.Account;

public interface AuthenticationService {
    String loginAdmin(LoginRequest request);

    String login(LoginRequest request);

    UserLoginResponse userLogin();

    Boolean register(RegisterRequest request);

    Account checkMail(String email);

    String sendOtp(String email);

    Boolean change(RegisterRequest request);

    Boolean changePass(ChangeRequest request);

    String loginGoogle(LoginGoogleRequest request);
}
