package com.fshoes.core.client.service.impl;

import com.fshoes.core.client.model.request.ClientAddressRequest;
import com.fshoes.core.client.model.response.ClientAddressResponse;
import com.fshoes.core.client.repository.ClientAccountRepository;
import com.fshoes.core.client.repository.ClientAddressRepository;
import com.fshoes.core.client.service.ClientAddressService;
import com.fshoes.core.common.UserLogin;
import com.fshoes.entity.Address;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientAddressServiceImpl implements ClientAddressService {

    @Autowired
    private ClientAddressRepository repository;

    @Autowired
    private ClientAccountRepository userRepo;

    @Override
    public Page<ClientAddressResponse> getPageAddressByIdCustomer(int p, UserLogin userLogin) {
        try {
            Pageable pageable = PageRequest.of(p, 5);
            return repository.getPageAddressByIdCustomer(pageable, userLogin.getUserLogin().getId());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public Address getAddressDefault(UserLogin userLogin) {
        if (userLogin.getUserLogin() != null) {
            return repository.getAddressDefault(userLogin.getUserLogin().getId());
        }
        return null;
    }

    @Override
    public Boolean updateDefault(UserLogin userLogin, String idAdrress) {
        List<Address> addressList = repository.getStatusAddressByIdCustomer(userLogin.getUserLogin().getId());
        if (!addressList.isEmpty()) {
            for (Address address : addressList) {
                address.setType(false);
                if (address.getId().equals(idAdrress)) {
                    address.setType(true);
                }
                repository.save(address);
            }
            return true;
        }
        return false;
    }

    @Override
    public Address add(ClientAddressRequest request, UserLogin userLogin) {
        try {
            Address address = request.newAddress(new Address());
            address.setAccount(userRepo.findById(userLogin.getUserLogin().getId()).orElse(null));
            return repository.save(address);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public Boolean update(String id, ClientAddressRequest request) {
        Optional<Address> addressOptional = repository.findById(id);
        if (addressOptional.isPresent()) {
            Address address = request.newAddress(addressOptional.get());
            repository.save(address);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Address getOne(String id) {
        return repository.findById(id).orElse(null);
    }
}
