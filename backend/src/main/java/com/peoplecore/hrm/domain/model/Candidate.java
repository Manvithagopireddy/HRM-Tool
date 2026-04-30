package com.peoplecore.hrm.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Job applicant / candidate entity.
 */
@Entity
@Table(name = "candidates", indexes = {
    @Index(name = "idx_cnd_job",   columnList = "job_id"),
    @Index(name = "idx_cnd_stage", columnList = "stage"),
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Candidate {

    @Id
    @Column(length = 10)
    private String id;

    @NotBlank
    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Email
    @Column(length = 200)
    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    @Builder.Default
    private CandidateStage stage = CandidateStage.APPLIED;

    @Min(1) @Max(5)
    @Column
    private Integer rating;

    @Column(name = "applied_date")
    private LocalDate appliedDate;

    @Column(name = "avatar_initials", length = 4)
    private String avatarInitials;

    @Column(name = "avatar_color", length = 10)
    private String avatarColor;

    // ── Enum ────────────────────────────────────────────────

    public enum CandidateStage {
        APPLIED, SCREENING, INTERVIEW, OFFER, HIRED, REJECTED
    }
}
