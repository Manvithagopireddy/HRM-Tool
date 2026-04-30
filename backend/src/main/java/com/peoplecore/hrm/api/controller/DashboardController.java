package com.peoplecore.hrm.api.controller;

import com.peoplecore.hrm.api.dto.DashboardStatsDto;
import com.peoplecore.hrm.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Dashboard REST controller.
 *
 * <pre>
 *   GET /api/dashboard/stats  — aggregated KPIs + chart data
 * </pre>
 */
@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> stats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }
}
