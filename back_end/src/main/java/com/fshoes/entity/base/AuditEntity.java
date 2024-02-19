package com.fshoes.entity.base;

import com.fshoes.infrastructure.listener.AuditEntityListener;
import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@MappedSuperclass
@EntityListeners(AuditEntityListener.class)
public abstract class AuditEntity {

    @Column(updatable = false)
    private Long createdAt;

    @Column
    private Long updatedAt;

    @Column
    private String createdBy;

    @Column
    private String updatedBy;
}
