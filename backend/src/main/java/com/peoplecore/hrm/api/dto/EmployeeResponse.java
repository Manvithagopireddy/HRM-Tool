package com.peoplecore.hrm.api.dto;

import com.peoplecore.hrm.domain.model.Employee;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

/** Read-only DTO returned by the API for an employee. */
@Data
public class EmployeeResponse {
    private String id;
    private String empCode;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String department;
    private Long departmentId;
    private String location;
    private BigDecimal salary;
    private Employee.EmployeeStatus status;
    private LocalDate joinDate;
    private String avatarInitials;
    private String avatarColor;
    private String managerName;
    private Employee.EmploymentType employmentType;
    private Double performanceScore;
    private Employee.Gender gender;
    private Integer age;

    // Payroll convenience fields
    private BigDecimal grossMonthly;
    private BigDecimal netMonthly;
}
