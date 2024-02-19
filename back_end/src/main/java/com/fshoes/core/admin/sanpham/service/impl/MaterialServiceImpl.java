package com.fshoes.core.admin.sanpham.service.impl;

import com.fshoes.core.admin.sanpham.model.request.MaterialFilterRequest;
import com.fshoes.core.admin.sanpham.model.request.MaterialRequest;
import com.fshoes.core.admin.sanpham.model.respone.MaterialResponse;
import com.fshoes.core.admin.sanpham.repository.AdMaterialRepository;
import com.fshoes.core.admin.sanpham.service.MaterialService;
import com.fshoes.entity.Material;
import com.fshoes.infrastructure.constant.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MaterialServiceImpl implements MaterialService {

    @Autowired
    private AdMaterialRepository materialRepository;

    public List<Material> findAll() {
        return materialRepository.findAll();
    }

    @Override
    public List<Material> getListMaterial() {
        return materialRepository.findAllByDeleted(Status.HOAT_DONG);
    }

    @Override
    public Page<MaterialResponse> getMaterial(MaterialFilterRequest materialFilterRequest) {
        Pageable pageable = PageRequest.of(materialFilterRequest.getPage() - 1, materialFilterRequest.getSize());
        return materialRepository.getMaterialByFilter(materialFilterRequest, pageable);
    }

    @Override
    public Material addMaterial(MaterialRequest materialRequest) {
        Material material = materialRequest.tranMaterial(new Material());
        material.setDeleted(0);
        return materialRepository.save(material);
    }

    @Override
    public Material updateMaterial(String id, MaterialRequest materialRequest) {
        Optional<Material> materialOptional = materialRepository.findById(id);
        if (materialOptional.isPresent()) {
            Material material = materialRequest.tranMaterial(materialOptional.get());
            return materialRepository.save(material);
        } else {
            return null;
        }
    }

    @Override
    public Boolean swapMaterial(String id) {
        Optional<Material> materialOptional = materialRepository.findById(id);
        if (materialOptional.isPresent()) {
            Material material = materialOptional.get();
            if (material.getDeleted() == 0) {
                material.setDeleted(1);
            } else {
                material.setDeleted(0);
            }
            materialRepository.save(material);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public List<String> getAllNameMaterial() {
        return materialRepository.getAllNameMaterial();
    }
}
