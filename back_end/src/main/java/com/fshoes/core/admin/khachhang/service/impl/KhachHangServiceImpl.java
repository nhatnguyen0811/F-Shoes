package com.fshoes.core.admin.khachhang.service.impl;

import com.fshoes.core.admin.khachhang.model.request.AdKhachHangSearch;
import com.fshoes.core.admin.khachhang.model.request.KhachHangRequest;
import com.fshoes.core.admin.khachhang.model.respone.KhachHangRespone;
import com.fshoes.core.admin.khachhang.repository.KhachHangRepository;
import com.fshoes.core.admin.khachhang.service.KhachHangService;
import com.fshoes.entity.Account;
import com.fshoes.infrastructure.cloudinary.CloudinaryImage;
import com.fshoes.infrastructure.constant.RoleAccount;
import com.fshoes.infrastructure.constant.Status;
import com.fshoes.infrastructure.email.Email;
import com.fshoes.infrastructure.email.EmailSender;
import com.fshoes.util.DateUtil;
import com.fshoes.util.MD5Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.text.ParseException;
import java.util.List;
import java.util.Optional;

@Service
public class KhachHangServiceImpl implements KhachHangService {
    @Autowired
    KhachHangRepository khachHangRepository;

    @Autowired
    private CloudinaryImage cloudinaryImage;

    @Autowired
    private EmailSender emailSender;

    @Override
    public Page<KhachHangRespone> findKhachHang(AdKhachHangSearch adKhachHangSearch) {
        Pageable pageable = PageRequest.of(adKhachHangSearch.getPage() - 1, adKhachHangSearch.getSize());
        return khachHangRepository.FindKhachHang(pageable, adKhachHangSearch);
    }


    @Override
    @Transactional
    public Account add(KhachHangRequest khachHangRequest) throws ParseException {
        Long dateBirth = DateUtil.parseDateLong(khachHangRequest.getDateBirth());
        String setCodeCustomer = "KH" + khachHangRepository.findAll().size();
        Account customer = new Account();
        customer.setCode(setCodeCustomer);
        customer.setFullName(khachHangRequest.getFullName());
        customer.setDateBirth(dateBirth);
        customer.setPhoneNumber(khachHangRequest.getPhoneNumber());
        customer.setEmail(khachHangRequest.getEmail());
        customer.setGender(khachHangRequest.getGender());
        customer.setRole(RoleAccount.values()[khachHangRequest.getRole()].ordinal());
        customer.setStatus(Status.values()[khachHangRequest.getStatus()].ordinal());

        if (khachHangRequest.getAvatar() != null) {
            customer.setAvatar(cloudinaryImage.uploadAvatar(khachHangRequest.getAvatar()));
        }
        String password = generatePassword();
        String[] toMail = {khachHangRequest.getEmail()};
        Email email = new Email();
        email.setBody("<b style=\"text-align: center;\">" + password + "</b>");
        email.setToEmail(toMail);
        email.setSubject("Tạo tài khoản thành công");
        email.setTitleEmail("Mật khẩu đăng nhập là:");
        emailSender.sendEmail(email);
        customer.setPassword(MD5Util.getMD5(password));

        return khachHangRepository.save(customer);
    }

    @Override
    @Transactional
    public Boolean update(String id, KhachHangRequest khachHangRequest) throws ParseException {
        Optional<Account> optionalCustomer = khachHangRepository.findById(id);
        if (optionalCustomer.isPresent()) {
            Account customer = khachHangRequest.newCustomer(optionalCustomer.get());
            if (khachHangRequest.getAvatar() != null) {
                customer.setAvatar(cloudinaryImage.uploadAvatar(khachHangRequest.getAvatar()));
            }
            khachHangRepository.save(customer);
            return true;

        } else {
            return false;
        }
    }

    @Override
    public void delete(String id) {
        Account customer = khachHangRepository.findById(id).orElse(null);
        assert customer != null;
        if (customer.getStatus() == 0) {
            customer.setStatus(1);
        } else {
            customer.setStatus(0);
        }
        khachHangRepository.save(customer);
    }

    @Override
    public Account getOne(String id) {
        return khachHangRepository.findById(id).orElse(null);
    }

    @Override
    public List<KhachHangRespone> getAllAccount() {
        return khachHangRepository.getAllAccount();
    }


    private String generatePassword() {
        String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        StringBuilder password = new StringBuilder();

        SecureRandom random = new SecureRandom();

        for (int i = 0; i < 12; i++) {
            int randomIndex = random.nextInt(CHARACTERS.length());
            char randomChar = CHARACTERS.charAt(randomIndex);
            password.append(randomChar);
        }

        return password.toString();
    }
}
