package com.fshoes.core.admin.notification.model;

import com.fshoes.entity.base.IsIdentified;
import org.springframework.beans.factory.annotation.Value;

public interface NotificationResponse extends IsIdentified {

    @Value("#{target.created_at}")
    Long getCreatedAt();

    String getTitle();

    String getContent();

    @Value("#{target.id_redirect}")
    String getIdRedirect();

    String getType();

    String getStatus();

    String getImage();
}
