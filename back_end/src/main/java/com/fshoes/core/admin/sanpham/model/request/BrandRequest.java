package com.fshoes.core.admin.sanpham.model.request;

import com.fshoes.entity.Brand;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BrandRequest {

    private String name;

    public Brand tranBrand(Brand brand) {
        brand.setName(this.name.trim());
        return brand;
    }
}
