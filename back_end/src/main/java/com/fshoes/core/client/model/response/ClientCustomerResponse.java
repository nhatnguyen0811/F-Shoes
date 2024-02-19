package com.fshoes.core.client.model.response;

import com.fshoes.entity.base.IsIdentified;

public interface ClientCustomerResponse extends IsIdentified {
    Integer getStt();

    String getAvatar();

    String getEmail();

    String getFullName();

    Long getDateBirth();

    String getPhoneNumber();

    Boolean getGender();

    Long getCreatedAt();

    Integer getStatus();

}
