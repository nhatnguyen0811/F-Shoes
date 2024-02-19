package com.fshoes.core.admin.sanpham.model.request;

import com.fshoes.entity.Material;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MaterialRequest {

    private String name;


    public Material tranMaterial(Material material) {
        material.setName(this.name.trim());
        return material;
    }
}
