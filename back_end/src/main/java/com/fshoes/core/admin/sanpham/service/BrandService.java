package com.fshoes.core.admin.sanpham.service;

import com.fshoes.core.admin.sanpham.model.request.BrandFilterRequest;
import com.fshoes.core.admin.sanpham.model.request.BrandRequest;
import com.fshoes.core.admin.sanpham.model.respone.BrandResponse;
import com.fshoes.entity.Brand;
import org.springframework.data.domain.Page;

import java.util.List;

public interface BrandService {
    List<Brand> findAll();

    List<Brand> getListBrand();

    Page<BrandResponse> getBrand(BrandFilterRequest brandFilterRequest);

    Brand addBrand(BrandRequest brandRequest);

    Brand updateBrand(String id, BrandRequest brandRequest);

    Boolean swapBrand(String id);

    List<String> getAllNameBrand();
}
