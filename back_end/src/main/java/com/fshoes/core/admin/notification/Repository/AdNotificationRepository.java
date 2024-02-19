package com.fshoes.core.admin.notification.Repository;

import com.fshoes.core.admin.notification.model.NotificationResponse;
import com.fshoes.repository.NotificationRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdNotificationRepository extends NotificationRepository {

    @Query(value = """
            select * from notification where id_account = :idAccount
            """, nativeQuery = true)
    List<NotificationResponse> allNotifications(String idAccount);
}
