package com.peoplecore.hrm.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/** Auth response DTO — returns JWT and user details. */
@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private String fullName;
    private String role;
    private String avatarInitials;
    private String avatarColor;
}
