package com.fshoes.core.authentication.service.impl;

import com.fshoes.core.authentication.model.request.ChangeRequest;
import com.fshoes.core.authentication.model.request.LoginGoogleRequest;
import com.fshoes.core.authentication.model.request.LoginRequest;
import com.fshoes.core.authentication.model.request.RegisterRequest;
import com.fshoes.core.authentication.model.response.UserLoginResponse;
import com.fshoes.core.authentication.repository.AuthenAccountRepository;
import com.fshoes.core.authentication.service.AuthenticationService;
import com.fshoes.core.common.UserLogin;
import com.fshoes.entity.Account;
import com.fshoes.infrastructure.constant.Message;
import com.fshoes.infrastructure.constant.RoleAccount;
import com.fshoes.infrastructure.email.Email;
import com.fshoes.infrastructure.email.EmailSender;
import com.fshoes.infrastructure.exception.RestApiException;
import com.fshoes.infrastructure.security.JwtUtilities;
import com.fshoes.util.MD5Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    @Autowired
    private AuthenAccountRepository accountRepository;
    @Autowired
    private JwtUtilities jwtUtilities;
    @Autowired
    private UserLogin userLogin;
    @Autowired
    private EmailSender emailSender;

    @Override
    public String loginAdmin(LoginRequest request) {
        String passwordEncode = MD5Util.getMD5(request.getPassword());
        Account account = accountRepository.findByEmailAndPassword(request.getEmail(), passwordEncode).orElse(null);
        if (account != null && account.getRole() != 2)
            return jwtUtilities.generateToken(account);
        return null;
    }

    @Override
    public String login(LoginRequest request) {
        String passwordEncode = MD5Util.getMD5(request.getPassword());
        Account account = accountRepository.findByEmailAndPassword(request.getEmail(), passwordEncode).orElse(null);
        if (account != null && account.getRole() == 2)
            return jwtUtilities.generateToken(account);
        return null;
    }

    @Override
    public UserLoginResponse userLogin() {
        Account account = userLogin.getUserLogin();
        if (account != null) {
            UserLoginResponse response = new UserLoginResponse();
            response.setId(account.getId());
            response.setEmail(account.getEmail());
            response.setName(account.getFullName());
            response.setAvatar(account.getAvatar());
            response.setRole(account.getRole());
            return response;
        }
        return null;
    }

    @Override
    public Boolean register(RegisterRequest request) {
        try {
            Account account = new Account();
            account.setEmail(request.getEmail());
            account.setFullName(request.getName());
            account.setPassword(MD5Util.getMD5(request.getPassword()));
            account.setRole(2);
            account.setCode("KH" + (accountRepository.countAllByRole(RoleAccount.KHACH_HANG) + 1));
            accountRepository.save(account);
            Email email = new Email();
            String[] emailSend = {request.getEmail()};
            email.setToEmail(emailSend);
            email.setSubject("Tạo tài khoản thành công");
            email.setTitleEmail("");
            email.setBody("<!DOCTYPE html>\n" +
                          "<html lang=\"en\">\n" +
                          "<body style=\"font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center; margin: 50px;\">\n" +
                          "\n" +
                          "    <div class=\"success-message\" style=\"background-color: #ff7f50; color: white; padding: 20px; border-radius: 10px; margin-top: 50px;\">\n" +
                          "        <h2 style=\"color: #333;\">Tài khoản đã được tạo thành công!</h2>\n" +
                          "        <p style=\"color: #555;\">Cảm ơn bạn đã đăng ký tại FShoes. Dưới đây là thông tin đăng nhập của bạn:</p>\n" +
                          "        <p><strong>Email:</strong> " + request.getEmail() + "</p>\n" +
                          "        <p><strong>Mật khẩu:</strong> " + request.getPassword() + "</p>\n" +
                          "        <p style=\"color: #555;\">Đăng nhập ngay để trải nghiệm!</p>\n" +
                          "    </div>\n" +
                          "\n" +
                          "</body>\n" +
                          "</html>\n");
            emailSender.sendEmail(email);
            return true;
        } catch (Exception e) {
            throw new RestApiException(Message.API_ERROR);
        }
    }

    @Override
    public Account checkMail(String email) {
        return accountRepository.findByEmail(email).orElse(null);
    }

    @Override
    public String sendOtp(String email) {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < 8; i++) {
            otp.append(random.nextInt(10));
        }

        // Tạo nội dung HTML cho email
        String htmlBody = "<h2>Quên Mật Khẩu</h2>"
                          + "<p>Xin chào,</p>"
                          + "<p>Dưới đây là mã OTP của bạn:</p>"
                          + "<h1 style=\"color: #2ecc71;\">" + otp.toString() + "</h1>"
                          + "<p>Vui lòng sử dụng mã OTP này để đặt lại mật khẩu của bạn.</p>"
                          + "<p>Cảm ơn bạn!</p>";

        Email newEmail = new Email();
        String[] emailSend = {email};
        newEmail.setToEmail(emailSend);
        newEmail.setSubject("Quên mật khẩu");
        newEmail.setTitleEmail("");
        newEmail.setBody(htmlBody);
        emailSender.sendEmail(newEmail);

        return otp.toString();
    }

    @Override
    public Boolean change(RegisterRequest request) {
        Account account = checkMail(request.getEmail());
        if (account == null) {
            return null;
        } else {
            account.setPassword(MD5Util.getMD5(request.getPassword()));
            accountRepository.save(account);
            return true;
        }
    }

    @Override
    public Boolean changePass(ChangeRequest request) {
        Account account = userLogin.getUserLogin();
        if (account.getPassword().equals(MD5Util.getMD5(request.getPassword()))) {
            account.setPassword(MD5Util.getMD5(request.getPassword()));
            accountRepository.save(account);
            return true;
        } else {
            return null;
        }
    }

    @Override
    public String loginGoogle(LoginGoogleRequest request) {
        Account account = accountRepository.findByEmail(request.getEmail()).orElse(null);
        if (account == null) {
            account = new Account();
            account.setEmail(request.getEmail());
            account.setFullName(request.getName());
            account.setAvatar(request.getImage());
            account.setRole(2);
            account.setCode("KH" + (accountRepository.countAllByRole(RoleAccount.KHACH_HANG) + 1));
            accountRepository.save(account);
        }
        if (account.getRole() == 2) {
            return jwtUtilities.generateToken(account);
        } else {
            throw new RestApiException("Email đã được sử dụng!");
        }
    }

}
