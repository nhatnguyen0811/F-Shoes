package com.fshoes.infrastructure.listener;

import com.fshoes.entity.base.AuditEntity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Calendar;

public class AuditEntityListener {

    @PrePersist
    private void onCreate(AuditEntity entity) {
        entity.setCreatedAt(getLongDate());
        entity.setUpdatedAt(getLongDate());
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            entity.setUpdatedBy(authentication.getName());
            entity.setCreatedBy(authentication.getName());
        }
    }

    @PreUpdate
    private void onUpdate(AuditEntity entity) {
        entity.setUpdatedAt(getLongDate());
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            String updatedBy = authentication.getName();
            entity.setUpdatedBy(updatedBy);
        }
    }

    private Long getLongDate() {
        return Calendar.getInstance().getTimeInMillis();
    }
}
