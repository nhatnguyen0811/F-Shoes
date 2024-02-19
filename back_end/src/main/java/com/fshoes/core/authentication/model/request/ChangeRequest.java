package com.fshoes.core.authentication.model.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangeRequest {
    private String newPassword;
    private String password;
}
