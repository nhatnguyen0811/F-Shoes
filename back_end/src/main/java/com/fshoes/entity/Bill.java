package com.fshoes.entity;

import com.fshoes.entity.base.PrimaryEntity;
import com.fshoes.infrastructure.constant.EntityProperties;
import com.fshoes.infrastructure.constant.StatusBill;
import com.fshoes.infrastructure.constant.TypeBill;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@ToString
@Table(name = "bill")
public class Bill extends PrimaryEntity {

    @Column(length = EntityProperties.LENGTH_CODE)
    private String code;

    @Column(columnDefinition = EntityProperties.DEFINITION_NAME)
    private String fullName;

    @Column(length = EntityProperties.LENGTH_PHONE)
    private String phoneNumber;

    @Column(columnDefinition = EntityProperties.DEFINITION_ADDRESS)
    private String address;

    private BigDecimal totalMoney;

    private BigDecimal moneyReduced;

    private BigDecimal moneyAfter;

    private Long shipDate;

    private Long receiveDate;

    private BigDecimal moneyShip;

    private Long confirmationDate;

    private TypeBill type;

    @Column(columnDefinition = EntityProperties.DEFINITION_DESCRIPTION)
    private String note;

    private BigDecimal customerAmount;

    private Long desiredReceiptDate;

    private Long completeDate;

    private StatusBill status;

    private Integer receivingMethod; //receivingMethod nếu mua tại quầy set là 0 còn giao hàng là 1 nhé

    private Integer percentMoney;

    @Column(length = EntityProperties.LENGTH_EMAIL)
    private String email;

    @ManyToOne
    @JoinColumn(name = "id_customer", referencedColumnName = "id")
    private Account customer;

    @ManyToOne
    @JoinColumn(name = "id_voucher", referencedColumnName = "id")
    private Voucher voucher;

    public Integer getType() {
        return type.ordinal();
    }

    public void setType(Integer type) {
        this.type = TypeBill.values()[type];
    }

    public Integer getStatus() {
        return status.ordinal();
    }

    public void setStatus(Integer status) {
        this.status = StatusBill.values()[status];
    }
}
