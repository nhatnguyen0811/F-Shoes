package com.fshoes.core.admin.thongke.Modal.Response;

import org.springframework.beans.factory.annotation.Value;

public interface ThongKeSanPhamResponse {
    @Value("#{target.status}")
    Long getStatus();

    @Value("#{target.soLuong}")
    Long getSoLuong();
}
