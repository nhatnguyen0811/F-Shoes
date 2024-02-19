package com.fshoes.core.client.repository;

import com.fshoes.core.client.model.response.ClientCustomerResponse;
import com.fshoes.core.client.model.response.ClientProfileBillDetailResponse;
import com.fshoes.repository.AccountRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientAccountRepository extends AccountRepository {
    @Query(value = """
                select  ROW_NUMBER() over (ORDER BY created_at desc ) as stt, id, avatar, email,
                 full_name as fullName,date_birth as dateBirth,phone_number as phoneNumber,
                 gender, created_at as createdAt, status from account 
            """, nativeQuery = true)
    List<ClientCustomerResponse> getAllAccount();

}
