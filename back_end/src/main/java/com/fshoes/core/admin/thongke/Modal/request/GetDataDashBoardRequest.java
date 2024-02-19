package com.fshoes.core.admin.thongke.Modal.request;

import com.fshoes.core.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetDataDashBoardRequest extends PageableRequest {
    private Integer soLuongSearch;
}
