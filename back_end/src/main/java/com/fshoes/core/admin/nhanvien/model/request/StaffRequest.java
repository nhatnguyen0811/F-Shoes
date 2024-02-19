package com.fshoes.core.admin.nhanvien.model.request;

import com.fshoes.entity.Account;
import com.fshoes.infrastructure.constant.EntityProperties;
import com.fshoes.util.DateUtil;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.text.ParseException;

@Getter
@Setter
public class StaffRequest {
    @NotBlank
    @Column(length = EntityProperties.LENGTH_NAME)
    private String fullName;

    private String dateBirth;

    @NotBlank
    private String phoneNumber;

    private String email;

    private Boolean gender;

    private MultipartFile avatar;

    private String CitizenId;

    private Integer role;

    private Integer status = 0;

    public Account tranStaff(Account staff) throws ParseException {
        staff.setFullName(this.getFullName());
        staff.setDateBirth(DateUtil.parseDateLong(this.getDateBirth()));
        staff.setPhoneNumber(this.getPhoneNumber());
        staff.setEmail(this.getEmail());
        staff.setGender(this.getGender());
        staff.setCitizenId(this.getCitizenId());
        staff.setRole(this.getRole());
        staff.setStatus(this.status);
        return staff;
    }
}
