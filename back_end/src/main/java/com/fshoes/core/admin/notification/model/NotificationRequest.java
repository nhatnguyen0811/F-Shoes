package com.fshoes.core.admin.notification.model;

import com.fshoes.entity.Account;
import com.fshoes.entity.Notification;
import com.fshoes.infrastructure.constant.Status;
import com.fshoes.infrastructure.constant.TypeNotification;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {

    private String id;

    private Long createdAt;

    private String title;

    private String content;

    private String idRedirect;

    private TypeNotification type;

    private Status status = Status.HOAT_DONG;

    private String image;

    public Notification tranNotification(Account account) {
        Notification notification = new Notification();
        notification.setImage(this.image);
        notification.setCreatedAt(this.createdAt);
        notification.setTitle(this.title);
        notification.setContent(this.content);
        notification.setIdRedirect(this.idRedirect);
        notification.setType(this.type);
        notification.setStatus(this.status);
        notification.setAccount(account);
        return notification;
    }

}
