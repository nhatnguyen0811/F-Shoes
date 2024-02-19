package com.fshoes.core.admin.nhanvien.service.impl;

import com.fshoes.core.admin.nhanvien.model.request.SearchStaff;
import com.fshoes.core.admin.nhanvien.model.request.StaffRequest;
import com.fshoes.core.admin.nhanvien.model.respone.StaffRespone;
import com.fshoes.core.admin.nhanvien.repository.StaffRepositorys;
import com.fshoes.core.admin.nhanvien.service.StaffService;
import com.fshoes.core.common.UserLogin;
import com.fshoes.entity.Account;
import com.fshoes.infrastructure.cloudinary.CloudinaryImage;
import com.fshoes.infrastructure.constant.RoleAccount;
import com.fshoes.infrastructure.constant.Status;
import com.fshoes.infrastructure.email.Email;
import com.fshoes.infrastructure.email.EmailSender;
import com.fshoes.util.DateUtil;
import com.fshoes.util.MD5Util;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.text.ParseException;
import java.util.List;
import java.util.Optional;

@Service
public class StaffServiceImpl implements StaffService {
    @Autowired
    UserLogin userLogin;
    @Autowired
    private StaffRepositorys repo;
    @Autowired
    private CloudinaryImage cloudinaryImage;
    @Autowired
    private EmailSender emailSender;

    @Override
    public List<StaffRespone> getAll() {
        return repo.getAllStaff();
    }


    @Override
    public Page<StaffRespone> searchStaff(SearchStaff searchStaff) {
        Pageable pageable = PageRequest.of(searchStaff.getPage() - 1, searchStaff.getSize());
        return repo.searchStaff(searchStaff, pageable, userLogin.getUserLogin().getId());
    }

    @Override
    public StaffRespone getOne(String id) {
        return repo.getOneStaff(id);
    }

    @Override
    @Transactional
    public Account add(@Valid StaffRequest staffRequest) throws ParseException {
        Long dateBirth = DateUtil.parseDateLong(staffRequest.getDateBirth());
        String setCodeStaff = "NV" + repo.findAll().size();
        Account staff = Account.builder()
                .code(setCodeStaff)
                .fullName(staffRequest.getFullName())
                .dateBirth(dateBirth)
                .phoneNumber(staffRequest.getPhoneNumber())
                .email(staffRequest.getEmail())
                .gender(staffRequest.getGender())
                .CitizenId(staffRequest.getCitizenId())
                .role(RoleAccount.values()[staffRequest.getRole()])
                .status(Status.values()[staffRequest.getStatus()])
                .build();

        if (staffRequest.getAvatar() != null) {
            staff.setAvatar(cloudinaryImage.uploadAvatar(staffRequest.getAvatar()));
        }
        String password = generatePassword();
        String[] toMail = {staffRequest.getEmail()};
        Email email = new Email();
        email.setBody("<b style=\"text-align: center;\">" + password + "</b>");
        email.setToEmail(toMail);
        email.setSubject("Tạo tài khoản thành công");
        email.setTitleEmail("Mật khẩu đăng nhập là:");
        emailSender.sendEmail(email);
        staff.setPassword(MD5Util.getMD5(password));
        return repo.save(staff);
    }

    @Override
    @Transactional
    public Boolean update(StaffRequest staffRequest, String id) throws ParseException {
        Optional<Account> optional = repo.findById(id);
        if (optional.isPresent()) {
            Account staff = staffRequest.tranStaff(optional.get());
            if (staffRequest.getAvatar() != null) {
                staff.setAvatar(cloudinaryImage.uploadAvatar(staffRequest.getAvatar()));
            }
            repo.save(staff);
            return true;

        } else {
            return false;
        }
    }

    @Override
    public Account delete(String id) {
        Account staff = repo.findById(id).orElse(null);
        assert staff != null;
        if (staff.getStatus() == 0) {
            staff.setStatus(1);
        } else {
            staff.setStatus(0);
        }
        return repo.save(staff);
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
