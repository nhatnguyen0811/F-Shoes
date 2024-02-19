package com.fshoes.entity;

import com.fshoes.entity.base.PrimaryEntity;
import com.fshoes.infrastructure.constant.EntityProperties;
import com.fshoes.infrastructure.constant.StatusBill;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "bill_history")
public class BillHistory extends PrimaryEntity {
    private StatusBill statusBill;

    @Column(columnDefinition = EntityProperties.DEFINITION_DESCRIPTION)
    private String note;

    @ManyToOne
    @JoinColumn(name = "id_bill", referencedColumnName = "id")
    private Bill bill;

    @ManyToOne
    @JoinColumn(name = "id_account", referencedColumnName = "id")
    private Account account;

    @ManyToOne
    @JoinColumn(name = "id_reception_staff", referencedColumnName = "id")
    private Account receptionStaff;

    public Integer getStatusBill() {
        return statusBill.ordinal();
    }

    public void setStatusBill(Integer statusBill) {
        this.statusBill = StatusBill.values()[statusBill];
    }
}
