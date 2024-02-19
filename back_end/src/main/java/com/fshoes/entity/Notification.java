package com.fshoes.entity;

import com.fshoes.entity.base.PrimaryEntity;
import com.fshoes.infrastructure.constant.EntityProperties;
import com.fshoes.infrastructure.constant.Status;
import com.fshoes.infrastructure.constant.TypeNotification;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "notification")
public class Notification extends PrimaryEntity {

    @Column(columnDefinition = EntityProperties.DEFINITION_NAME)
    private String title;

    @Column(columnDefinition = EntityProperties.DEFINITION_NAME)
    private String content;

    private String idRedirect;

    @Enumerated(EnumType.STRING)
    private TypeNotification type;

    @Enumerated(EnumType.STRING)
    private Status status = Status.HOAT_DONG;

    private String image;

    @ManyToOne
    @JoinColumn(name = "id_account", referencedColumnName = "id")
    private Account account;
}
