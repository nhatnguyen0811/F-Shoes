package com.fshoes.core.admin.nhanvien.repository;

import com.fshoes.core.admin.nhanvien.model.request.SearchStaff;
import com.fshoes.core.admin.nhanvien.model.request.StaffRequest;
import com.fshoes.core.admin.nhanvien.model.respone.StaffRespone;
import com.fshoes.entity.Account;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffRepositorys extends JpaRepository<Account, String> {

    @Query(value = "select id,code, full_name, date_birth, citizen_id, phone_number, email" +
                   ", gender, password, avatar, role, status from account Where id = :id", nativeQuery = true)
    StaffRespone getOneStaff(String id);

    @Query(value = "select id,code, full_name, date_birth,phone_number, citizen_id,email" +
                   ", gender, password, avatar, role from account where role=0 or role=1", nativeQuery = true)
    List<StaffRespone> getAll(StaffRequest request);

    @Query(value = "select ROW_NUMBER() over (ORDER BY created_at desc ) as stt, id,code, full_name, date_birth,phone_number, citizen_id,email" +
            ", gender, password, avatar,status, role from account where role=0 or role=1", nativeQuery = true)
    List<StaffRespone> getAllStaff();

    @Query(value = "SELECT ROW_NUMBER() over (ORDER BY created_at desc ) as stt, id,code, full_name, date_birth, phone_number, citizen_id, email, gender, password, avatar, role, created_at, status FROM account " +
                   "where id <> :idStaff and (role=0 or role=1) and" +
                   "(:#{#x.searchTen} is null or full_name like %:#{#x.searchTen}% or email like %:#{#x.searchTen}% or phone_number like %:#{#x.searchTen}%) " +
                   "and (:#{#x.genderSearch} is null or gender=:#{#x.genderSearch}) " +
                   "and (:#{#x.statusSearch} is null or status=:#{#x.statusSearch}) " +
                   "and (:#{#x.roleSearch} is null or role=:#{#x.roleSearch}) " +
                   "ORDER BY created_at DESC", nativeQuery = true)
    Page<StaffRespone> searchStaff(SearchStaff x, Pageable pageable, String idStaff);
}
