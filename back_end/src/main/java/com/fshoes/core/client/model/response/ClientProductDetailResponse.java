package com.fshoes.core.client.model.response;

import com.fshoes.entity.base.IsIdentified;
import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;

public interface ClientProductDetailResponse extends IsIdentified {

    @Value("#{target.size}")
    Float getSize();

    String getIdColor();

    BigDecimal getGia();

    String getWeight();

    String getCodeColor();
    String getNameColor();
}
