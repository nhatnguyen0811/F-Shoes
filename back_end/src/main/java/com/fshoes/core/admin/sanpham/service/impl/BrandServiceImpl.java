package com.fshoes.core.admin.sanpham.service.impl;

import com.fshoes.core.admin.sanpham.model.request.BrandFilterRequest;
import com.fshoes.core.admin.sanpham.model.request.BrandRequest;
import com.fshoes.core.admin.sanpham.model.respone.BrandResponse;
import com.fshoes.core.admin.sanpham.repository.AdBrandRepository;
import com.fshoes.core.admin.sanpham.service.BrandService;
import com.fshoes.entity.Brand;
import com.fshoes.infrastructure.constant.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BrandServiceImpl implements BrandService {

    @Autowired
    private AdBrandRepository brandRepository;

    @Override
    public List<Brand> findAll() {
        return brandRepository.findAll();
    }

    @Override
    public List<Brand> getListBrand() {
        return brandRepository.findAllByDeleted(Status.HOAT_DONG);
    }

    @Override
    public Page<BrandResponse> getBrand(BrandFilterRequest brandFilterRequest) {
        Pageable pageable = PageRequest.of(brandFilterRequest.getPage() - 1, brandFilterRequest.getSize());
        return brandRepository.getBrandByFilter(brandFilterRequest, pageable);
    }

    @Override
    public Brand addBrand(BrandRequest brandRequest) {
        Brand brand = brandRequest.tranBrand(new Brand());
        brand.setDeleted(0);
        return brandRepository.save(brand);
    }

    @Override
    public Brand updateBrand(String id, BrandRequest brandRequest) {
        Optional<Brand> brandOptional = brandRepository.findById(id);
        if (brandOptional.isPresent()) {
            Brand brand = brandRequest.tranBrand(brandOptional.get());
            return brandRepository.save(brand);
        } else {
            return null;
        }
    }

    @Override
    public Boolean swapBrand(String id) {
        Optional<Brand> brandOptional = brandRepository.findById(id);
        if (brandOptional.isPresent()) {
            Brand brand = brandOptional.get();
            if (brand.getDeleted() == 0) {
                brand.setDeleted(1);
            } else {
                brand.setDeleted(0);
            }
            brandRepository.save(brand);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public List<String> getAllNameBrand() {
        return brandRepository.getAllNameBrand();
    }
}
