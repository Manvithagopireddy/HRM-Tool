package com.peoplecore.hrm.service;

import com.peoplecore.hrm.api.dto.DashboardStatsDto;
import com.peoplecore.hrm.domain.model.Employee;
import com.peoplecore.hrm.domain.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Dashboard service — aggregates KPIs and chart data into a single payload.
 *
 * <p>Designed to be called once per page-load; results can be cached
 * with {@code @Cacheable} in production.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final EmployeeRepository   employeeRepository;
    private final LeaveRequestRepository leaveRepository;
    private final JobRepository         jobRepository;
    private final CandidateRepository   candidateRepository;

    public DashboardStatsDto getStats() {
        DashboardStatsDto dto = new DashboardStatsDto();

        // ── KPI cards ───────────────────────────────────────────
        long total   = employeeRepository.count();
        long active  = employeeRepository.findByStatus(Employee.EmployeeStatus.ACTIVE).size();
        long onLeave = employeeRepository.findByStatus(Employee.EmployeeStatus.ON_LEAVE).size();
        long pending = leaveRepository.countPending();
        BigDecimal monthlyPayroll = employeeRepository.sumActiveSalaries()
                .divide(BigDecimal.valueOf(12), 2, java.math.RoundingMode.HALF_UP);
        Double avgPerf = employeeRepository.avgPerformanceScore();

        dto.setTotalEmployees(total);
        dto.setActiveEmployees(active);
        dto.setOnLeave(onLeave);
        dto.setPendingLeaves(pending);
        dto.setMonthlyPayroll(monthlyPayroll);
        dto.setAvgPerformanceScore(avgPerf != null ? Math.round(avgPerf * 10.0) / 10.0 : 0.0);
        dto.setOpenJobs(jobRepository.findByStatus(
                com.peoplecore.hrm.domain.model.Job.JobStatus.OPEN).size());
        dto.setTotalCandidates(candidateRepository.count());

        // ── Employees by department ──────────────────────────────
        List<Object[]> deptCounts = employeeRepository.countByDepartment();
        Map<String, Long> deptMap = deptCounts.stream()
                .collect(Collectors.toMap(
                        r -> (String) r[0],
                        r -> (Long)   r[1],
                        (a, b) -> a,
                        LinkedHashMap::new
                ));
        dto.setEmployeesByDepartment(deptMap);

        // ── Candidates by stage ──────────────────────────────────
        List<Object[]> stageCounts = candidateRepository.countByStage();
        Map<String, Long> stageMap = stageCounts.stream()
                .collect(Collectors.toMap(
                        r -> r[0].toString(),
                        r -> (Long) r[1],
                        (a, b) -> a,
                        LinkedHashMap::new
                ));
        dto.setCandidatesByStage(stageMap);

        // ── Payroll trend (last 12 months — static seed) ─────────
        // In a real system this would query a payroll_runs table
        dto.setMonths(List.of("May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr"));
        dto.setPayrollTrend(List.of(
                new BigDecimal("61200"), new BigDecimal("68900"), new BigDecimal("68900"),
                new BigDecimal("75400"), new BigDecimal("75400"), new BigDecimal("82100"),
                new BigDecimal("82100"), new BigDecimal("82100"), new BigDecimal("89800"),
                new BigDecimal("89800"), new BigDecimal("91500"), new BigDecimal("91500")
        ));

        return dto;
    }
}
