package com.fshoes.core.admin.hoadon.model.respone;

import com.fshoes.entity.base.IsIdentified;

public interface HDBillHistoryResponse extends IsIdentified {

    String getIdBill();

    Long getCreatedAt();

    Integer getStatusBill();

    String getNote();

    String getCreatedBy();

    String getEmail();

    String getFullName();

    Integer getRole();

    String getCodeAccount();

}
