package com.fshoes.core.admin.khachhang.model.request;

import com.fshoes.core.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class AdKhachHangSearch extends PageableRequest {
    private String nameSearch;
    private Boolean gender;
    private Integer statusSearch;
}
