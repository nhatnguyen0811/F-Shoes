package com.fshoes.core.admin.sanpham.model.request;

import com.fshoes.entity.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SizeRequest {

    private String size;


    public Size tranSize(Size size) {
        size.setSize(Float.valueOf(this.size));
        return size;
    }
}
