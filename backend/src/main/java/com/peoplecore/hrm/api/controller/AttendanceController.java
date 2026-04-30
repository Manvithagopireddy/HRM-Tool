package com.peoplecore.hrm.api.controller;

import com.peoplecore.hrm.service.AttendanceService;
import com.peoplecore.hrm.domain.model.AttendanceRecord.AttendanceStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Attendance REST controller.
 *
 * <pre>
 *   GET  /api/attendance/summary?from=&to=   — summary per employee
 *   GET  /api/attendance/{empId}             — records for one employee
 *   POST /api/attendance                     — mark attendance
 * </pre>
 */
@RestController
@RequestMapping("/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping("/summary")
    public ResponseEntity<List<Map<String, Object>>> summary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(attendanceService.getEmployeeSummary(from, to));
    }

    @GetMapping("/{empId}")
    public ResponseEntity<List<Map<String, Object>>> byEmployee(@PathVariable String empId) {
        return ResponseEntity.ok(attendanceService.getRecordsForEmployee(empId));
    }

    @PostMapping
    public ResponseEntity<Void> mark(@RequestBody Map<String, String> body) {
        attendanceService.markAttendance(
                body.get("empId"),
                LocalDate.parse(body.get("date")),
                AttendanceStatus.valueOf(body.get("status").toUpperCase()),
                body.getOrDefault("checkIn",  "-"),
                body.getOrDefault("checkOut", "-")
        );
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
