package com.fshoes.core.authentication.model.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationResponse {
    private String title;
    private String idRedirect;
    private String type;
    private String status;
}
