package com.peoplecore.hrm.api.controller;

import com.peoplecore.hrm.service.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

/**
 * Payroll REST controller.
 *
 * <pre>
 *   GET /api/payroll              — current month payroll report
 *   GET /api/payroll?period=...   — specific pay period (e.g. "April 2026")
 *   GET /api/payroll/total        — total monthly cost
 * </pre>
 */
@RestController
@RequestMapping("/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> payrollReport(
            @RequestParam(required = false) String period) {
        String payPeriod = period != null
                ? period
                : YearMonth.now().format(DateTimeFormatter.ofPattern("MMMM yyyy"));
        return ResponseEntity.ok(payrollService.generatePayrollReport(payPeriod));
    }

    @GetMapping("/total")
    public ResponseEntity<Map<String, BigDecimal>> totalPayroll() {
        return ResponseEntity.ok(Map.of("totalMonthlyPayroll", payrollService.totalMonthlyPayroll()));
    }
}
