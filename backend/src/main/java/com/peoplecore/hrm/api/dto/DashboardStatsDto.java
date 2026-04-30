package com.peoplecore.hrm.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Aggregated dashboard stats — returned by GET /api/dashboard/stats.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDto {

    private long totalEmployees;
    private long activeEmployees;
    private long onLeave;
    private long pendingLeaves;
    private BigDecimal monthlyPayroll;
    private double avgPerformanceScore;
    private long openJobs;
    private long totalCandidates;

    // chart data
    private Map<String, Long> employeesByDepartment;
    private Map<String, Long> candidatesByStage;
    private List<String> months;
    private List<BigDecimal> payrollTrend;
}
