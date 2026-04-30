package com.peoplecore.hrm.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Leave request entity.
 */
@Entity
@Table(name = "leave_requests", indexes = {
    @Index(name = "idx_leave_emp",    columnList = "emp_id"),
    @Index(name = "idx_leave_status", columnList = "status"),
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LeaveRequest {

    @Id
    @Column(length = 20)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emp_id", nullable = false)
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(name = "leave_type", nullable = false, length = 20)
    private LeaveType leaveType;

    @Column(name = "from_date", nullable = false)
    private LocalDate fromDate;

    @Column(name = "to_date", nullable = false)
    private LocalDate toDate;

    @Positive
    @Column(nullable = false)
    private Integer days;

    @Column(length = 500)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    @Builder.Default
    private LeaveStatus status = LeaveStatus.PENDING;

    @Column(name = "applied_on")
    private LocalDate appliedOn;

    // ── Enums ────────────────────────────────────────────────

    public enum LeaveType {
        ANNUAL, SICK, MEDICAL, PERSONAL, MATERNITY, PATERNITY, UNPAID
    }

    public enum LeaveStatus {
        PENDING, APPROVED, REJECTED, CANCELLED
    }
}
