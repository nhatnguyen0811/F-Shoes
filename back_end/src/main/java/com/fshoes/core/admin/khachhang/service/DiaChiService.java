package com.fshoes.core.admin.khachhang.service;

import com.fshoes.core.admin.khachhang.model.request.DiaChiRequest;
import com.fshoes.core.admin.khachhang.model.respone.DiaChiRespone;
import com.fshoes.entity.Address;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface DiaChiService {

    List<Address> getAll();

    Page<DiaChiRespone> getAllAddressByIdCustomer(int p, String idCustomer);

    Address getOne(String id);

    Page<Address> getPage(int p);

    Address add(DiaChiRequest diaChiRequest);

    Boolean update(String id, DiaChiRequest DiaChiRequest);

    void delete(String id);


    ResponseEntity<?> getAllProvince();

    ResponseEntity<?> getAllDistrict(Integer idProvince);

    ResponseEntity<?> getAllWard(Integer idDistrict);

    ResponseEntity<?> getShippingOrder(String from_district_id, String service_id, String to_district_id, String to_ward_code, String weight, String insurance_value);

    ResponseEntity<?> getServiceGhn(String shop_id, String from_district, String to_district);

    ResponseEntity<?> getTimeGhn(String from_district_id, String from_ward_code, String to_district_id, String to_ward_code, String service_id);

    Boolean updateDefault(String idCustomer, String idAdrress);

    Address getAddressDefault(String idCustomer);
}
