package com.fshoes.core.admin.sanpham.model.respone;

import com.fshoes.entity.base.IsIdentified;

public interface SizeResponse extends IsIdentified {
    Float getSize();

    Integer getDeleted();

    Long getCreatedAt();
}
