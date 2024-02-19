package com.fshoes.core.admin.thongke.Modal.request;

import com.fshoes.core.common.PageableRequest;
import com.fshoes.util.DateUtil;
import lombok.Getter;
import lombok.Setter;

import java.text.ParseException;

@Getter
@Setter
public class GetDataDashBoarhByDateRequest extends PageableRequest {
    private String startDate;
    private String endDate;

    public Long converDate(String date) throws ParseException {
        return DateUtil.parseDateLong(date);
    }
}
