package com.fshoes.core.client.model.response;

import com.fshoes.entity.base.IsIdentified;

public interface ClientAddressResponse extends IsIdentified {
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
