package com.fshoes.core.admin.hoadon.model.request;

import com.fshoes.entity.Bill;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HDBillHistoryRequest {

    private Bill bill;

    private String idStaff;

    private String note;

}
