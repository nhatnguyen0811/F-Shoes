package com.fshoes.core.admin.sanpham.service;


import com.fshoes.core.admin.sanpham.model.request.SizeFilterRequest;
import com.fshoes.core.admin.sanpham.model.request.SizeRequest;
import com.fshoes.core.admin.sanpham.model.respone.SizeResponse;
import com.fshoes.entity.Size;
import org.springframework.data.domain.Page;

import java.util.List;

public interface SizeService {
    List<Size> findAll();

    List<Size> getListSize();

    Page<SizeResponse> getSize(SizeFilterRequest sizeFilterRequest);

    Size addSize(SizeRequest sizeRequest);

    Size updateSize(String id, SizeRequest sizeRequest);

    Boolean swapSize(String id);

    List<Integer> getAllNameSize();
}
