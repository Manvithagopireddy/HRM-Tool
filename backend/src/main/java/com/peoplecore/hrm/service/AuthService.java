package com.peoplecore.hrm.service;

import com.peoplecore.hrm.api.dto.AuthRequest;
import com.peoplecore.hrm.api.dto.AuthResponse;
import com.peoplecore.hrm.domain.repository.UserRepository;
import com.peoplecore.hrm.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Authentication service — validates credentials and issues JWT tokens.
 * Also implements {@link UserDetailsService} so Spring Security can load
 * user details during filter-chain processing.
 */
@Service
@RequiredArgsConstructor
public class AuthService implements UserDetailsService {

    private final UserRepository       userRepository;
    private final JwtTokenProvider     jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    // ── UserDetailsService ────────────────────────────────────

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    // ── Login ─────────────────────────────────────────────────

    /**
     * Authenticates the user and returns a JWT + user profile.
     *
     * @param request login credentials
     * @return {@link AuthResponse} containing the bearer token
     */
    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        var user   = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        String jwt = jwtTokenProvider.generateToken((UserDetails) authentication.getPrincipal());

        return new AuthResponse(
                jwt,
                user.getEmail(),
                user.getFullName(),
                user.getRole().name(),
                user.getAvatarInitials(),
                user.getAvatarColor()
        );
    }
}
