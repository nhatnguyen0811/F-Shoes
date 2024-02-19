package com.fshoes.entity;

import com.fshoes.entity.base.PrimaryEntity;
import com.fshoes.infrastructure.constant.EntityProperties;
import com.fshoes.infrastructure.constant.StatusVoucher;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "promotion")
public class Promotion extends PrimaryEntity {

    @Column(columnDefinition = EntityProperties.DEFINITION_NAME, unique = true)
    private String name;

    private Long timeStart;

    private Long timeEnd;

    private Boolean type;

    private Integer value;

    private StatusVoucher status;

    public Integer getStatus() {
        return status.ordinal();
    }

    public void setStatus(Integer status) {
        this.status = StatusVoucher.values()[status];
    }

}
