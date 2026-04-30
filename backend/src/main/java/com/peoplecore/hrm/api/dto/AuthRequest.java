package com.peoplecore.hrm.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/** Auth request DTO (login). */
@Data
public class AuthRequest {
    @Email @NotBlank
    private String email;

    @NotBlank
    private String password;
}
