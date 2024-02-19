package com.fshoes.core.admin.hoadon.model.request;

import com.fshoes.core.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class HDNhanVienSearchRequest extends PageableRequest {

    private String txtSearch;


}
