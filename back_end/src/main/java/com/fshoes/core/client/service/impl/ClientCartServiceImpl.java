package com.fshoes.core.client.service.impl;

import com.fshoes.core.client.model.request.ClientAddCartRequest;
import com.fshoes.core.client.model.response.ClientCartResponse;
import com.fshoes.core.client.model.response.ClientPromotionResponse;
import com.fshoes.core.client.repository.CLientPromotionRepository;
import com.fshoes.core.client.repository.ClientCartRepository;
import com.fshoes.core.client.repository.ClientProductDetailRepository;
import com.fshoes.core.client.service.ClientCartService;
import com.fshoes.core.common.UserLogin;
import com.fshoes.entity.Account;
import com.fshoes.entity.Cart;
import com.fshoes.infrastructure.constant.Message;
import com.fshoes.infrastructure.exception.RestApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientCartServiceImpl implements ClientCartService {
    @Autowired
    ClientProductDetailRepository productDetailRepository;
    @Autowired
    CLientPromotionRepository promotionRepository;
    @Autowired
    private UserLogin userLogin;
    @Autowired
    private ClientCartRepository cartRepository;

    @Override
    public List<ClientCartResponse> getCart() {
        try {
            return cartRepository.getAllCart(userLogin.getUserLogin().getId());
        } catch (Exception e) {
            throw new RestApiException(Message.API_ERROR);
        }
    }

    @Override
    public Boolean addCart(ClientAddCartRequest request) {
        try {
            Account account = userLogin.getUserLogin();
            if (account != null) {
                Cart cart = cartRepository.findByAccountIdAndProductDetailId(account.getId(), request.getIdProduct())
                        .orElse(new Cart());
                cart.setAccount(account);
                cart.setProductDetail(productDetailRepository.findById(request.getIdProduct())
                        .orElseThrow(() -> new RestApiException(Message.PRODUCT_DETAIL_NOT_EXIST)));
                cart.setQuantity(request.getAmount());
                if (request.getAmount() > 0) {
                    cartRepository.save(cart);
                } else if (cart.getId() != null) {
                    cartRepository.delete(cart);
                }
                return true;
            }
        } catch (Exception e) {
            throw new RestApiException(Message.API_ERROR);
        }
        return null;
    }

    @Override
    public Boolean setCart(List<ClientAddCartRequest> request) {
        try {
            Account account = userLogin.getUserLogin();
            if (account != null) {
                cartRepository.deleteAll(cartRepository.findAllByAccountId(account.getId()));
                List<Cart> list = request.stream().map(req -> {
                    Cart cart = cartRepository
                            .findByAccountIdAndProductDetailId(account.getId(), req.getIdProduct())
                            .orElse(new Cart());
                    cart.setAccount(account);
                    cart.setProductDetail(productDetailRepository.findById(req.getIdProduct())
                            .orElseThrow(() -> new RestApiException(Message.PRODUCT_DETAIL_NOT_EXIST)));
                    cart.setQuantity(req.getAmount());
                    return cart;
                }).toList();
                cartRepository.saveAll(list);
                return true;
            }
        } catch (Exception e) {
            throw new RestApiException(Message.API_ERROR);
        }
        return null;
    }

    @Override
    public List<ClientPromotionResponse> getPromotionByProductDetail(List<String> idProductDetail) {
        return promotionRepository.getPromotionByProductDetail(idProductDetail);
    }
}
