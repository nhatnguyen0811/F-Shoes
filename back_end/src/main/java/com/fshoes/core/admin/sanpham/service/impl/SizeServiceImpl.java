package com.fshoes.core.admin.sanpham.service.impl;

import com.fshoes.core.admin.sanpham.model.request.SizeFilterRequest;
import com.fshoes.core.admin.sanpham.model.request.SizeRequest;
import com.fshoes.core.admin.sanpham.model.respone.SizeResponse;
import com.fshoes.core.admin.sanpham.repository.AdSizeRepository;
import com.fshoes.core.admin.sanpham.service.SizeService;
import com.fshoes.entity.Size;
import com.fshoes.infrastructure.constant.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SizeServiceImpl implements SizeService {

    @Autowired
    private AdSizeRepository sizeRepository;

    public List<Size> findAll() {
        return sizeRepository.findAll();
    }

    @Override
    public List<Size> getListSize() {
        return sizeRepository.findAllByDeletedOrderBySizeAsc(Status.HOAT_DONG);
    }

    @Override
    public Page<SizeResponse> getSize(SizeFilterRequest sizeFilterRequest) {
        Pageable pageable = PageRequest.of(sizeFilterRequest.getPageNumber() - 1, sizeFilterRequest.getPageSize());
        return sizeRepository.getSizeByFilter(sizeFilterRequest, pageable);
    }

    @Override
    public Size addSize(SizeRequest sizeRequest) {
        Size size = sizeRequest.tranSize(new Size());
        size.setDeleted(0);
        return sizeRepository.save(size);
    }

    @Override
    public Size updateSize(String id, SizeRequest sizeRequest) {
        Optional<Size> sizeOptional = sizeRepository.findById(id);
        if (sizeOptional.isPresent()) {
            Size size = sizeRequest.tranSize(sizeOptional.get());
            return sizeRepository.save(size);
        } else {
            return null;
        }
    }

    @Override
    public Boolean swapSize(String id) {
        Optional<Size> sizeOptional = sizeRepository.findById(id);
        if (sizeOptional.isPresent()) {
            Size size = sizeOptional.get();
            if (size.getDeleted() == 0) {
                size.setDeleted(1);
            } else {
                size.setDeleted(0);
            }
            sizeRepository.save(size);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public List<Integer> getAllNameSize() {
        return sizeRepository.getAllNameSize();
    }
}
