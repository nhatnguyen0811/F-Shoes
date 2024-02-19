package com.fshoes.core.admin.sanpham.model.respone;

import com.fshoes.entity.base.IsIdentified;

public interface ColorResponse extends IsIdentified {

    String getCode();

    String getName();

    Integer getDeleted();

    Long getCreatedAt();
}
