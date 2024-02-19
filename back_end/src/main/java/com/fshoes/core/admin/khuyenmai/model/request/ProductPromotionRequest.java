package com.fshoes.core.admin.khuyenmai.model.request;

import com.fshoes.entity.ProductPromotion;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductPromotionRequest {

    private String pricePromotion;


    private String idProductDetail;


    private String idPromotion;

    public ProductPromotion newProductProduct(ProductPromotion productPromotion) {
        productPromotion.getPromotion().setId(idPromotion);
        productPromotion.getProductDetail().setId(idProductDetail);

        productPromotion.setPricePromotion(BigDecimal.valueOf(Long.parseLong(pricePromotion)));
        return productPromotion;
    }
}
