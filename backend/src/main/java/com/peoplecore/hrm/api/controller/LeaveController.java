package com.peoplecore.hrm.api.controller;

import com.peoplecore.hrm.api.dto.LeaveRequestDto;
import com.peoplecore.hrm.domain.model.LeaveRequest.LeaveStatus;
import com.peoplecore.hrm.service.LeaveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Leave management REST controller.
 *
 * <pre>
 *   GET    /api/leaves                    — all requests
 *   GET    /api/leaves?status=PENDING     — filter by status
 *   GET    /api/leaves/employee/{empId}   — by employee
 *   POST   /api/leaves                    — submit new request
 *   PATCH  /api/leaves/{id}/status        — approve or reject
 * </pre>
 */
@RestController
@RequestMapping("/leaves")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;

    @GetMapping
    public ResponseEntity<List<LeaveRequestDto>> list(
            @RequestParam(required = false) LeaveStatus status) {
        List<LeaveRequestDto> result = status != null
                ? leaveService.findByStatus(status)
                : leaveService.findAll();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/employee/{empId}")
    public ResponseEntity<List<LeaveRequestDto>> byEmployee(@PathVariable String empId) {
        return ResponseEntity.ok(leaveService.findByEmployee(empId));
    }

    @PostMapping
    public ResponseEntity<LeaveRequestDto> submit(@Valid @RequestBody LeaveRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(leaveService.submit(dto));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<LeaveRequestDto> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        LeaveStatus newStatus = LeaveStatus.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(leaveService.updateStatus(id, newStatus));
    }
}
