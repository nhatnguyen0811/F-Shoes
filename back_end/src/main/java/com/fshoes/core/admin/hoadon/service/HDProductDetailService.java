package com.fshoes.core.admin.hoadon.service;

import com.fshoes.core.admin.hoadon.model.respone.HDProductDetailResponse;

public interface HDProductDetailService {
    HDProductDetailResponse getPrdVsMaxKMValue(String id);

//    Boolean isCheckSoLuongPrd(String idPrd, Integer soLuong);

}
