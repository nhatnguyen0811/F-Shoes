package com.fshoes.core.client.model.response;

import com.fshoes.entity.base.IsIdentified;
import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;

public interface ClientProductPromotionResponse extends IsIdentified {

    String getName();

    Float getSize();

    String getAmount();

    String getDescription();

    BigDecimal getPrice();

    String getImage();

    String getWeight();

    @Value("#{target.id_product}")
    String getIdProduct();

    @Value("#{target.id_color}")
    String getIdColor();

    @Value("#{target.id_material}")
    String getIdMaterial();

    @Value("#{target.id_sole}")
    String getIdSole();

    @Value("#{target.id_category}")
    String getIdCategory();

    @Value("#{target.id_brand}")
    String getIdBrand();


}
