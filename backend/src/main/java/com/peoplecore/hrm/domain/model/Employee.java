package com.peoplecore.hrm.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Employee entity — the central aggregate of the HRM domain.
 */
@Entity
@Table(name = "employees", indexes = {
    @Index(name = "idx_emp_department", columnList = "department_id"),
    @Index(name = "idx_emp_status",     columnList = "status"),
    @Index(name = "idx_emp_email",      columnList = "email", unique = true),
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Employee {

    /** Business key (e.g. EMP001) — also used as PK for readability */
    @Id
    @Column(name = "id", length = 10)
    private String id;

    @NotBlank
    @Column(name = "emp_code", unique = true, length = 10, nullable = false)
    private String empCode;

    @NotBlank
    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Email @NotBlank
    @Column(nullable = false, unique = true, length = 200)
    private String email;

    @Column(length = 30)
    private String phone;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(length = 100)
    private String location;

    @NotNull @Positive
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal salary;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private EmployeeStatus status;

    @Column(name = "join_date")
    private LocalDate joinDate;

    @Column(name = "avatar_initials", length = 4)
    private String avatarInitials;

    @Column(name = "avatar_color", length = 10)
    private String avatarColor;

    @Column(name = "manager_name", length = 100)
    private String managerName;

    @Enumerated(EnumType.STRING)
    @Column(name = "employment_type", length = 15)
    private EmploymentType employmentType;

    @DecimalMin("0.0") @DecimalMax("5.0")
    @Column(name = "performance_score")
    private Double performanceScore;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private Gender gender;

    @Min(16) @Max(100)
    private Integer age;

    // ── Enums ─────────────────────────────────────────────────

    public enum EmployeeStatus {
        ACTIVE, INACTIVE, ON_LEAVE
    }

    public enum EmploymentType {
        FULL_TIME, PART_TIME, CONTRACT
    }

    public enum Gender {
        MALE, FEMALE, OTHER
    }
}
