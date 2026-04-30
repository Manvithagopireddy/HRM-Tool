package com.peoplecore.hrm.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Application user — implements Spring Security's {@link UserDetails}.
 * Roles are mapped to {@code ROLE_<role>} authorities automatically.
 */
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_user_email", columnList = "email", unique = true),
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Email @NotBlank
    @Column(nullable = false, unique = true, length = 200)
    private String email;

    @NotBlank
    @Column(name = "password_hash", nullable = false, length = 100)
    private String passwordHash;

    @NotBlank
    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role;

    @Column(name = "avatar_initials", length = 4)
    private String avatarInitials;

    @Column(name = "avatar_color", length = 10)
    private String avatarColor;

    // ── Spring Security ──────────────────────────────────────

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override public String getPassword()           { return passwordHash; }
    @Override public String getUsername()           { return email; }
    @Override public boolean isAccountNonExpired()  { return true; }
    @Override public boolean isAccountNonLocked()   { return true; }
    @Override public boolean isCredentialsNonExpired(){ return true; }
    @Override public boolean isEnabled()            { return true; }

    // ── Enum ────────────────────────────────────────────────

    public enum UserRole {
        HR_MANAGER, HR_SPECIALIST, ADMIN
    }
}
