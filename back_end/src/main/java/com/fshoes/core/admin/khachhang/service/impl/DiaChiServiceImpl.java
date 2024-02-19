package com.fshoes.core.admin.khachhang.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fshoes.core.admin.khachhang.model.request.DiaChiRequest;
import com.fshoes.core.admin.khachhang.model.respone.*;
import com.fshoes.core.admin.khachhang.repository.DiaChiRepository;
import com.fshoes.core.admin.khachhang.repository.KhachHangRepository;
import com.fshoes.core.admin.khachhang.service.DiaChiService;
import com.fshoes.entity.Address;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class DiaChiServiceImpl implements DiaChiService {
    @Autowired
    private DiaChiRepository diaChiRepository;

    @Autowired
    private KhachHangRepository khachHangRepository;


    @Value("${api.ghn.token}")
    private String tokenApiGhn;

    @Value("${api.ghn.ShopId}")
    private String shopId;


    @Override
    public List<Address> getAll() {
        return diaChiRepository.findAll();
    }

    @Override
    public Page<DiaChiRespone> getAllAddressByIdCustomer(int p, String idCustomer) {
        Pageable pageable = PageRequest.of(p, 5);
        return diaChiRepository.getPageAddressByIdCustomer(pageable, idCustomer);
    }

    @Override
    public Address getOne(String id) {
        return diaChiRepository.findById(id).orElse(null);
    }

    @Override
    public Page<Address> getPage(int p) {
        Pageable pageable = PageRequest.of(p, 2);
        return diaChiRepository.findAll(pageable);
    }

    @Override
    public Address add(DiaChiRequest diaChiRequest) {
        try {
            Address address = diaChiRequest.newAddress(new Address());
            address.setAccount(khachHangRepository.findById(diaChiRequest.getIdCustomer()).orElse(null));
            return diaChiRepository.save(address);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public Boolean update(String id, DiaChiRequest diaChiRequest) {
        Optional<Address> addressOptional = diaChiRepository.findById(id);
        if (addressOptional.isPresent()) {
            Address address = diaChiRequest.newAddress(addressOptional.get());
            diaChiRepository.save(address);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public void delete(String id) {
        diaChiRepository.deleteById(id);
    }

    @Override
    public ResponseEntity<List<ProvinceRespone>> getAllProvince() {
        String uri = "https://online-gateway.ghn.vn/shiip/public-api/master-data/province";
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("token", tokenApiGhn);
        HttpEntity<?> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.GET, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode dataArray = rootNode.get("data");
                if (dataArray.isArray()) {
                    List<ProvinceRespone> provinceResponeList = new ArrayList<>();
                    for (int i = 0; i < dataArray.size(); i++) {
                        JsonNode firstElement = dataArray.get(i);
                        int provinceID = firstElement.get("ProvinceID").asInt();
                        String provinceName = firstElement.get("ProvinceName").asText();
                        provinceResponeList.add(new ProvinceRespone(provinceID, provinceName));
                    }
                    return ResponseEntity.ok(provinceResponeList);

                } else {
                    System.out.println("Không có dữ liệu hoặc dữ liệu không phải là mảng.");
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public ResponseEntity<?> getAllDistrict(Integer idProvince) {
        String uri = "https://online-gateway.ghn.vn/shiip/public-api/master-data/district";
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("token", tokenApiGhn);
        HttpEntity<?> entity = new HttpEntity<>(headers);

        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(uri)
                .queryParam("province_id", idProvince);

        ResponseEntity<String> response = restTemplate.exchange(builder.toUriString(), HttpMethod.GET, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode dataArray = rootNode.get("data");
                if (dataArray.isArray()) {
                    List<DistrictResponse> districtResponseList = new ArrayList<>();
                    for (int i = 0; i < dataArray.size(); i++) {
                        JsonNode districtNode = dataArray.get(i);
                        int districtID = districtNode.get("DistrictID").asInt();
                        String districtName = districtNode.get("DistrictName").asText();
                        districtResponseList.add(new DistrictResponse(districtID, districtName));
                    }
                    return ResponseEntity.ok(districtResponseList);
                } else {
                    System.out.println("Không có dữ liệu hoặc dữ liệu không phải là mảng.");
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public ResponseEntity<?> getAllWard(Integer idDistrict) {
        String uri = "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward";
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("token", tokenApiGhn);
        HttpEntity<?> entity = new HttpEntity<>(headers);

        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(uri)
                .queryParam("district_id", idDistrict);

        ResponseEntity<String> response = restTemplate.exchange(builder.toUriString(), HttpMethod.GET, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode dataArray = rootNode.get("data");
                if (dataArray.isArray()) {
                    List<WardResponse> wardCodeList = new ArrayList<>();
                    for (int i = 0; i < dataArray.size(); i++) {
                        JsonNode districtNode = dataArray.get(i);
                        int wardCode = districtNode.get("WardCode").asInt();
                        String wardName = districtNode.get("WardName").asText();
                        wardCodeList.add(new WardResponse(wardCode, wardName));
                    }
                    return ResponseEntity.ok(wardCodeList);
                } else {
                    System.out.println("Không có dữ liệu hoặc dữ liệu không phải là mảng.");
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public ResponseEntity<ShippingOrderResponse> getShippingOrder(String from_district_id, String service_id, String to_district_id, String to_ward_code, String weight, String insurance_value) {
        String uri = "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee";
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("token", tokenApiGhn);
        HttpEntity<?> entity = new HttpEntity<>(headers);

        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(uri)
                .queryParam("from_district_id", from_district_id)
                .queryParam("service_id", service_id)
                .queryParam("to_district_id", to_district_id)
                .queryParam("to_ward_code", to_ward_code)
                .queryParam("weight", weight)
                .queryParam("insurance_value", insurance_value);

        ResponseEntity<String> response = restTemplate.exchange(builder.toUriString(), HttpMethod.GET, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode dataNode = rootNode.get("data");
                Double total = dataNode.get("total").asDouble();
                ShippingOrderResponse shippingOrderResponse = new ShippingOrderResponse(total);

                return ResponseEntity.ok(shippingOrderResponse);
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public ResponseEntity<?> getServiceGhn(String shop_id, String from_district, String to_district) {
        String uri = "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services";
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("token", tokenApiGhn);
        HttpEntity<?> entity = new HttpEntity<>(headers);

        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(uri)
                .queryParam("shop_id", shop_id)
                .queryParam("from_district", from_district)
                .queryParam("to_district", to_district);

        ResponseEntity<String> response = restTemplate.exchange(builder.toUriString(), HttpMethod.GET, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode rootNode = objectMapper.readTree(response.getBody());

                JsonNode dataNode = rootNode.get("data");
                if (dataNode != null && dataNode.isArray() && dataNode.size() > 0) {
                    String service_id = dataNode.get(0).get("service_id").asText();
                    ServiceId serviceId = new ServiceId(service_id);

                    return ResponseEntity.ok(serviceId);
                } else {
                    return new ResponseEntity<>("Không có dịch vụ nào được tìm thấy", HttpStatus.NOT_FOUND);
                }
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public ResponseEntity<TimeGhn> getTimeGhn(
            String from_district_id,
            String from_ward_code,
            String to_district_id,
            String to_ward_code,
            String service_id) {

        String uri = "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime";
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("token", tokenApiGhn);
        HttpEntity<?> entity = new HttpEntity<>(headers);

        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(uri)
                .queryParam("from_district_id", from_district_id)
                .queryParam("from_ward_code", from_ward_code)
                .queryParam("to_district_id", to_district_id)
                .queryParam("to_ward_code", to_ward_code)
                .queryParam("service_id", service_id);

        ResponseEntity<String> response = restTemplate.exchange(builder.toUriString(), HttpMethod.GET, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                Integer leadtime = rootNode.get("data").get("leadtime").asInt();
                TimeGhn timeGhn = new TimeGhn(leadtime);
                return ResponseEntity.ok(timeGhn);
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public Boolean updateDefault(String idCustomer, String idAdrress) {
        List<Address> addressList = diaChiRepository.getStatusAddressByIdCustomer(idCustomer);
        if (!addressList.isEmpty()) {
            for (Address address : addressList) {
                address.setType(false);
                if (address.getId().equals(idAdrress)) {
                    address.setType(true);
                }
                diaChiRepository.save(address);
            }
            return true;
        }
        return false;
    }

    @Override
    public Address getAddressDefault(String idCustomer) {
        return diaChiRepository.getAddressDefault(idCustomer);
    }
}
