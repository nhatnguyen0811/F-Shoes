package com.fshoes.core.admin.voucher.service.impl;

import com.fshoes.core.admin.voucher.model.request.AdCustomerVoucherRequest;
import com.fshoes.core.admin.voucher.model.respone.AdCustomerVoucherRespone;
import com.fshoes.core.admin.voucher.repository.AdCustomerVoucherRepository;
import com.fshoes.core.admin.voucher.service.AdCustomerVoucherService;
import com.fshoes.core.common.PageableRequest;
import com.fshoes.entity.CustomerVoucher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdCustomerVoucherServiceImpl implements AdCustomerVoucherService {
    @Autowired
    private AdCustomerVoucherRepository adCustomerVoucherRepository;

    @Override
    public List<AdCustomerVoucherRespone> getAllCustomerVoucher() {
        return adCustomerVoucherRepository.getAll();
    }

    @Override
    public AdCustomerVoucherRespone getCustomerVoucherById(String id) {
        return adCustomerVoucherRepository.getOneById(id);
    }

    @Override
    public Page<AdCustomerVoucherRespone> getPageCustomerVoucher(PageableRequest pageableRequest) {
        Sort sort = Sort.by("id");
        Pageable pageable = PageRequest.of(pageableRequest.getPage() - 1, pageableRequest.getSize(), sort);
        return adCustomerVoucherRepository.getPage(pageable);
    }

    @Override
    public CustomerVoucher addCustomerVoucher(AdCustomerVoucherRequest adCustomerVoucherRequest) {
        try {
            CustomerVoucher customerVoucher = adCustomerVoucherRequest.newCustomerVoucher(new CustomerVoucher());
            return adCustomerVoucherRepository.save(customerVoucher);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public Boolean deleteCustomerVoucher(String id) {
        Optional<CustomerVoucher> optionalCustomerVoucher = adCustomerVoucherRepository.findById(id);
        if (optionalCustomerVoucher.isPresent()) {
            CustomerVoucher customerVoucher = optionalCustomerVoucher.get();
            adCustomerVoucherRepository.save(customerVoucher);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public List<String> getIdCustomerByIdVoucher(String idVoucher) {
        return adCustomerVoucherRepository.getListIdCustomerByIdVoucher(idVoucher);
    }
}
