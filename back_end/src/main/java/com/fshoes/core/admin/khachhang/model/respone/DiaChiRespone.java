package com.fshoes.core.admin.khachhang.model.respone;

import com.fshoes.entity.base.IsIdentified;

public interface DiaChiRespone extends IsIdentified {

    Integer getStt();

    String getName();

    String getPhoneNumber();

    String getEmail();

    String getSpecificAddress();

    Integer getProvinceId();

    Integer getDistrictId();

    Integer getWardId();

    Boolean getType();

}
