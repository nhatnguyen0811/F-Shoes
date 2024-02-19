package com.fshoes.core.admin.nhanvien.model.respone;

import com.fshoes.entity.base.IsIdentified;
import org.springframework.beans.factory.annotation.Value;

public interface StaffRespone extends IsIdentified {

    Integer getStt();

    @Value("#{target.code}")
    String getCode();

    @Value("#{target.full_name}")
    String getfullName();

    @Value("#{target.date_birth}")
    Long getdateBirth();

    @Value("#{target.phone_number}")
    String getphoneNumber();

    @Value("#{target.email}")
    String getEmail();

    @Value("#{target.gender}")
    Boolean getGender();

    @Value("#{target.password}")
    String getPassword();

    @Value("#{target.avatar}")
    String getAvatar();

    @Value("#{target.citizen_id}")
    String getCitizenId();

    @Value("#{target.role}")
    Integer getRole();

    @Value("#{target.status}")
    Integer getStatus();
}
