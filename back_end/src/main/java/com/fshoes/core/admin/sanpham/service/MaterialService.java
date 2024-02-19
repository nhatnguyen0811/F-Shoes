package com.fshoes.core.admin.sanpham.service;

import com.fshoes.core.admin.sanpham.model.request.MaterialFilterRequest;
import com.fshoes.core.admin.sanpham.model.request.MaterialRequest;
import com.fshoes.core.admin.sanpham.model.respone.MaterialResponse;
import com.fshoes.entity.Material;
import org.springframework.data.domain.Page;

import java.util.List;

public interface MaterialService {
    List<Material> findAll();

    List<Material> getListMaterial();

    Page<MaterialResponse> getMaterial(MaterialFilterRequest materialFilterRequest);

    Material addMaterial(MaterialRequest materialRequest);

    Material updateMaterial(String id, MaterialRequest materialRequest);

    Boolean swapMaterial(String id);

    List<String> getAllNameMaterial();
}
