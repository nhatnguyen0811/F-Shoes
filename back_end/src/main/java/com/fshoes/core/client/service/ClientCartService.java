package com.fshoes.core.client.service;

import com.fshoes.core.client.model.request.ClientAddCartRequest;
import com.fshoes.core.client.model.response.ClientCartResponse;
import com.fshoes.core.client.model.response.ClientPromotionResponse;

import java.util.List;

public interface ClientCartService {
    List<ClientCartResponse> getCart();

    Boolean addCart(ClientAddCartRequest request);

    Boolean setCart(List<ClientAddCartRequest> request);

    List<ClientPromotionResponse> getPromotionByProductDetail(List<String> idProductDetail);
}
