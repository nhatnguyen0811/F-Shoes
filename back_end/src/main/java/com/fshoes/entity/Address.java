package com.fshoes.entity;

import com.fshoes.entity.base.PrimaryEntity;
import com.fshoes.infrastructure.constant.EntityProperties;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "address")
public class Address extends PrimaryEntity {


    @Column(columnDefinition = EntityProperties.DEFINITION_NAME)
    private String name;

    @Column(length = EntityProperties.LENGTH_PHONE)
    private String phoneNumber;


    @Column(length = EntityProperties.LENGTH_ID)
    private String provinceId;

    @Column(length = EntityProperties.LENGTH_ID)
    private String districtId;

    @Column(length = EntityProperties.LENGTH_ID)
    private String wardId;

    @Column(columnDefinition = EntityProperties.DEFINITION_ADDRESS)
    private String specificAddress;

    private Boolean type;

    @ManyToOne
    @JoinColumn(name = "id_account", referencedColumnName = "id")
    private Account account;

}
