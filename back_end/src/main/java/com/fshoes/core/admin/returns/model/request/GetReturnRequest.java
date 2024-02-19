package com.fshoes.core.admin.returns.model.request;

import com.fshoes.core.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetReturnRequest extends PageableRequest {
    private String text;
    private Integer status;
}
