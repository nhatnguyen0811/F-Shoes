package com.fshoes.core.client.model.request;

import com.fshoes.entity.Address;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClientAddressRequest {
    private String name;

    private String phoneNumber;

    private String specificAddress;

    private Boolean type;

    private String idCustomer;

    private String provinceId;

    private String districtId;

    private String wardId;


    public Address newAddress(Address address) {
        address.setName(this.name);
        address.setPhoneNumber(this.phoneNumber);
        address.setSpecificAddress(this.specificAddress);
        address.setType(this.getType());
        address.setProvinceId(this.provinceId);
        address.setDistrictId(this.districtId);
        address.setWardId(this.wardId);
        return address;
    }
}
