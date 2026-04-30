package com.peoplecore.hrm.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Open job posting entity.
 */
@Entity
@Table(name = "jobs", indexes = {
    @Index(name = "idx_job_department", columnList = "department_id"),
    @Index(name = "idx_job_status",     columnList = "status"),
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Job {

    @Id
    @Column(length = 10)
    private String id;

    @NotBlank
    @Column(nullable = false, length = 200)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(length = 100)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_type", length = 15)
    private Employee.EmploymentType jobType;

    @Column(name = "opened_date")
    private LocalDate openedDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    @Builder.Default
    private JobStatus status = JobStatus.OPEN;

    @Column
    private Integer applications;

    @Column(name = "posted_by", length = 100)
    private String postedBy;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private Priority priority;

    @Column(name = "days_open")
    private Integer daysOpen;

    @Column(name = "avg_time_to_fill")
    private Integer avgTimeToFill;

    // ── Enums ────────────────────────────────────────────────

    public enum JobStatus { OPEN, CLOSED, DRAFT, ON_HOLD }

    public enum Priority { LOW, MEDIUM, HIGH }
}
