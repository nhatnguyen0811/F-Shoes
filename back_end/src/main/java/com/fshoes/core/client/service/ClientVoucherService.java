package com.fshoes.core.client.service;


import com.fshoes.core.client.model.request.ClientVoucherRequest;
import com.fshoes.core.client.model.response.ClientVoucherResponse;
import com.fshoes.core.common.UserLogin;

import java.util.List;

public interface ClientVoucherService {
    List<ClientVoucherResponse> getAllVoucherByIdCustomer(ClientVoucherRequest request, UserLogin userLogin);

    ClientVoucherResponse getVoucherByCode(String codeVoucher);

    List<ClientVoucherResponse> getVoucherPublicMyProfile();

    List<ClientVoucherResponse> getVoucherPrivateMyProfile(UserLogin userLogin);
}
