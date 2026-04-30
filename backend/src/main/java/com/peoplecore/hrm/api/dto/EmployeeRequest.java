package com.peoplecore.hrm.api.dto;

import com.peoplecore.hrm.domain.model.Employee;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

/** DTO for creating / updating an employee. */
@Data
public class EmployeeRequest {

    @NotBlank(message = "Employee ID is required")
    @Pattern(regexp = "EMP\\d+", message = "ID must be format EMP followed by digits")
    private String id;

    @NotBlank
    private String fullName;

    @Email @NotBlank
    private String email;

    private String phone;

    @NotBlank
    private String role;

    @NotNull
    private Long departmentId;

    private String location;

    @NotNull @Positive
    private BigDecimal salary;

    private Employee.EmployeeStatus status;

    private LocalDate joinDate;

    private String avatarInitials;
    private String avatarColor;
    private String managerName;

    private Employee.EmploymentType employmentType;

    @DecimalMin("0.0") @DecimalMax("5.0")
    private Double performanceScore;

    private Employee.Gender gender;

    @Min(16) @Max(100)
    private Integer age;
}
