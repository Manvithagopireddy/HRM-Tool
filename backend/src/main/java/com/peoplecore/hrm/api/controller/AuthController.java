package com.peoplecore.hrm.api.controller;

import com.peoplecore.hrm.api.dto.AuthRequest;
import com.peoplecore.hrm.api.dto.AuthResponse;
import com.peoplecore.hrm.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication REST controller.
 *
 * <pre>
 *   POST /api/auth/login   — returns JWT token
 * </pre>
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Authenticates a user and returns a signed JWT.
     *
     * @param request {@link AuthRequest} containing email + password
     * @return {@link AuthResponse} with the bearer token and user profile
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
