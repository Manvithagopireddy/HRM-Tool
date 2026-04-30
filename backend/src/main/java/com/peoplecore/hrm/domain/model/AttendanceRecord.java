package com.peoplecore.hrm.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Attendance record — one row per employee per day.
 */
@Entity
@Table(name = "attendance_records", indexes = {
    @Index(name = "idx_att_emp_date", columnList = "emp_id, record_date", unique = true),
    @Index(name = "idx_att_date",     columnList = "record_date"),
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AttendanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emp_id", nullable = false)
    private Employee employee;

    @Column(name = "record_date", nullable = false)
    private LocalDate recordDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private AttendanceStatus status;

    @Column(name = "check_in",  length = 20)
    private String checkIn;

    @Column(name = "check_out", length = 20)
    private String checkOut;

    public enum AttendanceStatus {
        PRESENT, ABSENT, LATE, LEAVE, WEEKEND, HOLIDAY
    }
}
