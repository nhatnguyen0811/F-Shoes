package com.fshoes.core.admin.sanpham.model.request;

import com.fshoes.entity.Color;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ColorRequest {

    private String code;
    private String name;


    public Color tranColor(Color color) {
        color.setCode(this.code);
        color.setName(this.name);
        return color;
    }
}
