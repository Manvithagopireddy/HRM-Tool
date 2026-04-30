package com.peoplecore.hrm.api.controller;

import com.peoplecore.hrm.api.dto.LeaveCollision;
import com.peoplecore.hrm.api.dto.OrgChartNode;
import com.peoplecore.hrm.service.HrAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for HR Analytics driven by DSA.
 *
 * <pre>
 *   GET /api/analytics/org-chart           — Returns hierarchical tree via DFS
 *   GET /api/analytics/leave-collisions    — Returns overlapping leaves via Sweep Line
 * </pre>
 */
@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
public class HrAnalyticsController {

    private final HrAnalyticsService hrAnalyticsService;

    @GetMapping("/org-chart")
    public ResponseEntity<List<OrgChartNode>> getOrgChart() {
        return ResponseEntity.ok(hrAnalyticsService.generateOrgChart());
    }

    @GetMapping("/leave-collisions")
    public ResponseEntity<List<LeaveCollision>> getLeaveCollisions(
            @RequestParam(defaultValue = "2") int threshold) {
        return ResponseEntity.ok(hrAnalyticsService.findLeaveCollisions(threshold));
    }
}
