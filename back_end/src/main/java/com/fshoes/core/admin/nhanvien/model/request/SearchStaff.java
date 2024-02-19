package com.fshoes.core.admin.nhanvien.model.request;

import com.fshoes.core.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchStaff extends PageableRequest {

    private String searchTen;

    private Boolean genderSearch;

    private Integer statusSearch;

    private Integer roleSearch;

}
