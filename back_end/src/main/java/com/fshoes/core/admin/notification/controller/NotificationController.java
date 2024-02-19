package com.fshoes.core.admin.notification.controller;

import com.fshoes.core.admin.notification.Repository.AdNotificationRepository;
import com.fshoes.core.admin.notification.model.NotificationRequest;
import com.fshoes.core.common.ObjectRespone;
import com.fshoes.core.common.UserLogin;
import com.fshoes.entity.Notification;
import com.fshoes.infrastructure.constant.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {
    @Autowired
    private AdNotificationRepository notificationRepository;
    @Autowired
    private UserLogin userLogin;

    @GetMapping
    public ObjectRespone getNotifications() {
        return new ObjectRespone(notificationRepository.allNotifications(userLogin.getUserLogin().getId()));
    }

    @PostMapping("/save")
    public ObjectRespone saveNotifications(@RequestBody NotificationRequest request) {
        try {
            Notification notification = notificationRepository
                    .save(request.tranNotification(userLogin.getUserLogin()));
            return new ObjectRespone(new NotificationRequest(
                    notification.getId(),
                    notification.getCreatedAt(),
                    notification.getTitle(),
                    notification.getContent(),
                    notification.getIdRedirect(),
                    notification.getType(),
                    notification.getStatus(),
                    notification.getImage()));
        } catch (Exception e) {
            e.printStackTrace();
            return new ObjectRespone(null);
        }
    }

    @PutMapping("/read/{id}")
    public ObjectRespone redNotifications(@PathVariable String id) {
        try {
            Notification notification = notificationRepository
                    .findById(id).get();
            notification.setStatus(Status.NGUNG_HOAT_DONG);
            notificationRepository.save(notification);
            return new ObjectRespone(new NotificationRequest(
                    notification.getId(),
                    notification.getCreatedAt(),
                    notification.getTitle(),
                    notification.getContent(),
                    notification.getIdRedirect(),
                    notification.getType(),
                    notification.getStatus(),
                    notification.getImage()));
        } catch (Exception e) {
            e.printStackTrace();
            return new ObjectRespone(null);
        }
    }
}
