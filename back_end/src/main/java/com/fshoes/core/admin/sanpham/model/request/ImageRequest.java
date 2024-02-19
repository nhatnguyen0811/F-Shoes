package com.fshoes.core.admin.sanpham.model.request;

import com.fshoes.entity.Product;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ImageRequest {

    private String image;
    private Boolean imageDefault;
}
