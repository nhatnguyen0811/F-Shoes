package com.fshoes.core.client.service;

import com.fshoes.core.client.model.request.ClientAddressRequest;
import com.fshoes.core.client.model.response.ClientAddressResponse;
import com.fshoes.core.common.UserLogin;
import com.fshoes.entity.Address;
import org.springframework.data.domain.Page;

public interface ClientAddressService {
    Page<ClientAddressResponse> getPageAddressByIdCustomer(int p, UserLogin userLogin);

    Address getAddressDefault(UserLogin userLogin);

    Boolean updateDefault(UserLogin userLogin, String idAdrress);

    Address add(ClientAddressRequest request, UserLogin userLogin);

    Boolean update(String id, ClientAddressRequest request);

    void delete(String id);

    Address getOne(String id);
}
