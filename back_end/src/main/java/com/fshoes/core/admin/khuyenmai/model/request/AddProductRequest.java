package com.fshoes.core.admin.khuyenmai.model.request;

import com.fshoes.entity.ProductDetail;
import com.fshoes.entity.ProductPromotion;
import com.fshoes.entity.Promotion;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddProductRequest {

    private Promotion promotion;

    private ProductDetail productDetail;

    public ProductPromotion newProductPromoton(ProductPromotion productPromotion) {
        productPromotion.setPromotion(this.getPromotion());
        productPromotion.setProductDetail(this.getProductDetail());
        return productPromotion;
    }
}
