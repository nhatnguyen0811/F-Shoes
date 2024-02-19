package com.fshoes.core.admin.sell.repository;

import com.fshoes.core.admin.sell.model.request.AdCustomerRequest;
import com.fshoes.core.admin.sell.model.response.GetALlCustomerResponse;
import com.fshoes.repository.AccountRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminSellGetCustomerRepository extends AccountRepository {
    @Query(value = "Select ROW_NUMBER() over (ORDER BY created_at desc ) as stt, id, avatar, email, full_name as fullName," +
                   "date_birth as dateBirth,phone_number as phoneNumber," +
                   "gender, created_at as createdAt, status from account " +
                   "where  (:#{#AKS.nameSearch} is null or full_name like %:#{#AKS.nameSearch}% or email like %:#{#AKS.nameSearch}% or phone_number like %:#{#AKS.nameSearch}%) " +
                   "and (:#{#AKS.gender} is null or gender=:#{#AKS.gender}) " +
                   "and (:#{#AKS.statusSearch} is null or status=:#{#AKS.statusSearch}) and role = 2 " +
                   "order by created_at desc", nativeQuery = true)
    Page<GetALlCustomerResponse> FindKhachHang(Pageable pageable, AdCustomerRequest AKS);

}
