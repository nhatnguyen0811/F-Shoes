package com.fshoes.entity;

import com.fshoes.entity.base.PrimaryEntity;
import com.fshoes.infrastructure.constant.EntityProperties;
import com.fshoes.infrastructure.constant.Status;
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
@Table(name = "material")
public class Material extends PrimaryEntity {

    @Column(columnDefinition = EntityProperties.DEFINITION_NAME)
    private String name;

    private Status deleted = Status.HOAT_DONG;

    public Integer getDeleted() {
        return deleted.ordinal();
    }

    public void setDeleted(Integer deleted) {
        this.deleted = Status.values()[deleted];
    }
}
