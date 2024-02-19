package com.fshoes.core.admin.sanpham.service.impl;

import com.fshoes.core.admin.sanpham.model.request.SoleFilterRequest;
import com.fshoes.core.admin.sanpham.model.request.SoleRequest;
import com.fshoes.core.admin.sanpham.model.respone.SoleResponse;
import com.fshoes.core.admin.sanpham.repository.AdSoleRepository;
import com.fshoes.core.admin.sanpham.service.SoleService;
import com.fshoes.entity.Sole;
import com.fshoes.infrastructure.constant.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SoleServiceImpl implements SoleService {

    @Autowired
    private AdSoleRepository soleRepository;

    public List<Sole> findAll() {
        return soleRepository.findAll();
    }

    @Override
    public List<Sole> getListSole() {
        return soleRepository.findAllByDeleted(Status.HOAT_DONG);
    }

    @Override
    public Page<SoleResponse> getSole(SoleFilterRequest soleFilterRequest) {
        Pageable pageable = PageRequest.of(soleFilterRequest.getPage() - 1, soleFilterRequest.getSize());
        return soleRepository.getSoleByFilter(soleFilterRequest, pageable);
    }

    @Override
    public Sole addSole(SoleRequest soleRequest) {
        Sole sole = soleRequest.tranSole(new Sole());
        sole.setDeleted(0);
        return soleRepository.save(sole);
    }

    @Override
    public Sole updateSole(String id, SoleRequest soleRequest) {
        Optional<Sole> soleOptional = soleRepository.findById(id);
        if (soleOptional.isPresent()) {
            Sole sole = soleRequest.tranSole(soleOptional.get());
            return soleRepository.save(sole);
        } else {
            return null;
        }
    }

    @Override
    public Boolean swapSole(String id) {
        Optional<Sole> soleOptional = soleRepository.findById(id);
        if (soleOptional.isPresent()) {
            Sole sole = soleOptional.get();
            if (sole.getDeleted() == 0) {
                sole.setDeleted(1);
            } else {
                sole.setDeleted(0);
            }
            soleRepository.save(sole);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public List<String> getAllNameSole() {
        return soleRepository.getAllNameSole();
    }
}
