package com.fshoes.core.admin.hoadon.model.respone;

import com.fshoes.entity.base.IsIdentified;

public interface HDNhanVienResponse extends IsIdentified {
    Integer getStt();

    String getAvatar();

    String getCode();

    String getEmail();

    String getFullName();

    Long getDateBirth();

    String getPhoneNumber();

    Boolean getGender();

    Long getCreatedAt();

    Integer getStatus();

}
