package com.fshoes.infrastructure.email;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Email {
    private String[] toEmail;
    private String subject;
    private String body;
    private String titleEmail;
}
