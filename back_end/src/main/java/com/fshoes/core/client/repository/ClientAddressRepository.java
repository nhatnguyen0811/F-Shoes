package com.fshoes.core.client.repository;

import com.fshoes.core.client.model.response.ClientAddressResponse;
import com.fshoes.entity.Address;
import com.fshoes.repository.AddressRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientAddressRepository extends AddressRepository {
    @Query(value = "Select ROW_NUMBER() over (ORDER BY created_at desc ) as stt, a.id, a.name, a.phone_number as phoneNumber, a.specific_address as specificAddress," +
                   " a.type , province_id as provinceId, district_id as districtId," +
                   " ward_id as wardId from address a where a.id_account = :idAccount order by created_at asc"
            , nativeQuery = true)
    Page<ClientAddressResponse> getPageAddressByIdCustomer(Pageable pageable, @Param("idAccount") String idAccount);

    @Query(value = "Select * from address a where a.id_account = :idAccount", nativeQuery = true)
    List<Address> getStatusAddressByIdCustomer(@Param("idAccount") String idAccount);

    @Query(value = "Select * from address a where a.id_account = :idAccount and type=1", nativeQuery = true)
    Address getAddressDefault(@Param("idAccount") String idAccount);
}
