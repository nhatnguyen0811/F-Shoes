package com.fshoes.core.admin.khachhang.controller;

import com.fshoes.core.admin.khachhang.service.DiaChiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ghn")
public class ApiGhnController {
    @Autowired
    private DiaChiService diaChiService;

    @GetMapping("/getProvince")
    public ResponseEntity<?> getProvince() {
        return diaChiService.getAllProvince();
    }

    @GetMapping("/getDistrict")
    public ResponseEntity<?> getDistrict(Integer idProvince) {
        return diaChiService.getAllDistrict(idProvince);
    }

    @GetMapping("/getWard")
    public ResponseEntity<?> getWard(Integer idDistrict) {
        return diaChiService.getAllWard(idDistrict);
    }


    @GetMapping("/getShipping-order")
    public ResponseEntity<?> getShippingOrder(@RequestParam("from_district_id") String from_district_id, @RequestParam("service_id") String service_id, @RequestParam("to_district_id") String to_district_id, @RequestParam("to_ward_code") String to_ward_code, @RequestParam("weight") String weight, @RequestParam("insurance_value") String insurance_value) {
        return ResponseEntity.ok().body(diaChiService.getShippingOrder(from_district_id, service_id, to_district_id, to_ward_code, weight, insurance_value));
    }

    @GetMapping("/get-serviceId")
    public ResponseEntity<?> getServiceId(@RequestParam("shop_id") String shop_id, @RequestParam("from_district") String from_district_id, @RequestParam("to_district") String to_district_id) {
        return ResponseEntity.ok().body(diaChiService.getServiceGhn(shop_id, from_district_id, to_district_id));
    }

    @GetMapping("/get-time")
    public ResponseEntity<?> getTime(@RequestParam("from_district_id") String from_district_id, @RequestParam("from_ward_code") String from_ward_code, @RequestParam("to_district_id") String to_district_id, @RequestParam("to_ward_code") String to_ward_code, @RequestParam("service_id") String service_id) {
        return ResponseEntity.ok().body(diaChiService.getTimeGhn(from_district_id, from_ward_code, to_district_id, to_ward_code, service_id));
    }
}
