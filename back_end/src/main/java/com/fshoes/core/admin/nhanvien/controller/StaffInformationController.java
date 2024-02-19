package com.fshoes.core.admin.nhanvien.controller;

import com.fshoes.core.admin.nhanvien.model.request.SearchStaff;
import com.fshoes.core.admin.nhanvien.model.request.StaffRequest;
import com.fshoes.core.admin.nhanvien.model.respone.StaffRespone;
import com.fshoes.core.admin.nhanvien.service.StaffService;
import com.fshoes.core.common.ObjectRespone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;

@RestController
@RequestMapping("/api/admin/information")
public class StaffInformationController {
    @Autowired
    private StaffService service;

    @GetMapping("/find-all")
    public List<StaffRespone> hienThi() {
        return service.getAll();
    }

    @GetMapping("/search-getPage")
    public ObjectRespone hienthiPageNo(@ModelAttribute SearchStaff searchStaff) {
        return new ObjectRespone(service.searchStaff(searchStaff));
    }

    @PostMapping("/add")
    public ResponseEntity add(@ModelAttribute StaffRequest staffRequest) throws ParseException {
        return new ResponseEntity(service.add(staffRequest), HttpStatus.OK);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity detail(@PathVariable String id) {
        return new ResponseEntity(service.getOne(id), HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity update(@PathVariable("id") String id,
                                 @ModelAttribute StaffRequest staffRequest) throws ParseException {
        return new ResponseEntity(service.update(staffRequest, id), HttpStatus.OK);
    }

    @PutMapping("/delete/{id}")
    public ObjectRespone delete(@PathVariable("id") String id) {
        return new ObjectRespone(service.delete(id));
    }
}
