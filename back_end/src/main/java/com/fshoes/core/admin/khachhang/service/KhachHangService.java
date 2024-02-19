package com.fshoes.core.admin.khachhang.service;

import com.fshoes.core.admin.khachhang.model.request.AdKhachHangSearch;
import com.fshoes.core.admin.khachhang.model.request.KhachHangRequest;
import com.fshoes.core.admin.khachhang.model.respone.KhachHangRespone;
import com.fshoes.entity.Account;
import org.springframework.data.domain.Page;

import java.text.ParseException;
import java.util.List;

public interface KhachHangService {


    Page<KhachHangRespone> findKhachHang(AdKhachHangSearch adKhachHangSearch);

    Account add(KhachHangRequest khachHangRequest) throws ParseException;

    Boolean update(String id, KhachHangRequest khachHangRequest) throws ParseException;

    void delete(String id);

    Account getOne(String id);

    List<KhachHangRespone> getAllAccount();


}
