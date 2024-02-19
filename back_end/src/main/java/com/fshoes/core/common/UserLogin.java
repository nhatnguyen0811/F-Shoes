package com.fshoes.core.common;

import com.fshoes.entity.Account;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserLogin {
    @Autowired
    private HttpSession session;

    public Account getUserLogin() {
        return (Account) session.getAttribute("user");
    }
}
