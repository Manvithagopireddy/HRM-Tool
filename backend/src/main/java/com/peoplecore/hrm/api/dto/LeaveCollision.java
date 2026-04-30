package com.peoplecore.hrm.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;

/**
 * Represents a time period where multiple employees are on leave concurrently.
 */
@Data
@AllArgsConstructor
public class LeaveCollision {
    private LocalDate startDate;
    private LocalDate endDate;
    private int concurrentLeaves;
}
