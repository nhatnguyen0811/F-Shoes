package com.fshoes.core.admin.nhanvien.service;

import com.fshoes.core.admin.nhanvien.model.request.SearchStaff;
import com.fshoes.core.admin.nhanvien.model.request.StaffRequest;
import com.fshoes.core.admin.nhanvien.model.respone.StaffRespone;
import com.fshoes.entity.Account;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;

import java.text.ParseException;
import java.util.List;

public interface StaffService {
    List<StaffRespone> getAll();

    Page<StaffRespone> searchStaff(SearchStaff searchStaff);

    StaffRespone getOne(String id);

    Account add(@Valid StaffRequest staffRequest) throws ParseException;

    Boolean update(StaffRequest staffRequest, String id) throws ParseException;

    Account delete(String id);
}
