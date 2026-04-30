package com.peoplecore.hrm.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;

/**
 * Department entity — represents an organisational unit within PeopleCore.
 */
@Entity
@Table(name = "departments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @NotNull
    @Positive
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal budget;

    /** Engagement score 0–100 from last survey */
    @Column(name = "engagement_score")
    private Integer engagementScore;

    /**
     * Attrition risk level for this department.
     * Stored as a string enum: LOW | MEDIUM | HIGH
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "attrition_risk", length = 10)
    private AttritionRisk attritionRisk;

    @Column(name = "avg_tenure_yrs")
    private Double avgTenureYrs;

    // ── Derived ───────────────────────────────────────────────
    /** Average salary — updated by EmployeeService on mutations */
    @Column(name = "avg_salary", precision = 12, scale = 2)
    private BigDecimal avgSalary;

    public enum AttritionRisk { LOW, MEDIUM, HIGH }
}
