package com.fshoes.core.client.model.response;

import java.math.BigDecimal;

public interface ClientMinMaxPrice {
    BigDecimal getMinPrice();

    BigDecimal getMaxPrice();
}
