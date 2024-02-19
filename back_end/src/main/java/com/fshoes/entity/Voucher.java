package com.fshoes.entity;

import com.fshoes.entity.base.PrimaryEntity;
import com.fshoes.infrastructure.constant.EntityProperties;
import com.fshoes.infrastructure.constant.StatusVoucher;
import com.fshoes.infrastructure.constant.TypeValue;
import com.fshoes.infrastructure.constant.TypeVoucher;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@ToString
@Table(name = "voucher")
public class Voucher extends PrimaryEntity {
    @Column(length = EntityProperties.LENGTH_CODE, unique = true)
    private String code;

    @Column(columnDefinition = EntityProperties.DEFINITION_NAME, unique = true)
    private String name;

    private BigDecimal value;

    private BigDecimal maximumValue;

    private TypeVoucher type;

    private TypeValue typeValue;

    private BigDecimal minimumAmount;

    private Integer quantity;

    private Long startDate;

    private Long endDate;

    private StatusVoucher status;

    public Integer getType() {
        return type.ordinal();
    }

    public void setType(Integer type) {
        this.type = TypeVoucher.values()[type];
    }

    public Integer getStatus() {
        return status.ordinal();
    }

    public void setStatus(Integer status) {
        this.status = StatusVoucher.values()[status];
    }

    public Integer getTypeValue() {
        return typeValue.ordinal();
    }

    public void setTypeValue(Integer typeValue) {
        this.typeValue = TypeValue.values()[typeValue];
    }
}
