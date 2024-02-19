package com.fshoes.core.client.model.request;

import com.fshoes.entity.Account;
import com.fshoes.infrastructure.constant.EntityProperties;
import com.fshoes.util.DateUtil;
import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.text.ParseException;

@Getter
@Setter
public class ClientAccountRequest {
    @Column(length = EntityProperties.LENGTH_NAME)
    private String fullName;

    private String dateBirth;

    private String phoneNumber;

    private String email;

    private Boolean gender;

    private MultipartFile avatar;

    private Integer role = 2;

    private Integer status = 0;


    public Account newCustomer(Account customer) throws ParseException {
        customer.setFullName(this.getFullName());
        customer.setDateBirth(DateUtil.parseDateLong(this.getDateBirth()));
        customer.setPhoneNumber(this.getPhoneNumber());
        customer.setEmail(this.getEmail());
        customer.setGender(this.getGender());
        customer.setRole(role);
        customer.setStatus(status);

        return customer;
    }
}
