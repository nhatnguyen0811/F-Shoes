package com.fshoes.core.admin.sanpham.service;

import com.fshoes.core.admin.sanpham.model.request.SoleFilterRequest;
import com.fshoes.core.admin.sanpham.model.request.SoleRequest;
import com.fshoes.core.admin.sanpham.model.respone.SoleResponse;
import com.fshoes.entity.Sole;
import org.springframework.data.domain.Page;

import java.util.List;

public interface SoleService {
    List<Sole> findAll();

    List<Sole> getListSole();

    Page<SoleResponse> getSole(SoleFilterRequest soleFilterRequest);

    Sole addSole(SoleRequest soleRequest);

    Sole updateSole(String id, SoleRequest soleRequest);

    Boolean swapSole(String id);

    List<String> getAllNameSole();
}
