package com.peoplecore.hrm.service;

import com.peoplecore.hrm.api.dto.EmployeeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

/**
 * Payroll service — calculates monthly payslips for all active employees.
 *
 * <p>Deduction model:
 * <ul>
 *   <li>22% federal tax</li>
 *   <li>4% health insurance</li>
 *   <li>3% 401-k retirement</li>
 * </ul>
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayrollService {

    private static final BigDecimal TAX_RATE        = new BigDecimal("0.22");
    private static final BigDecimal INSURANCE_RATE  = new BigDecimal("0.04");
    private static final BigDecimal RETIREMENT_RATE = new BigDecimal("0.03");

    private final EmployeeService    employeeService;

    /**
     * Generates payslip data for all employees for the current pay period.
     */
    public List<Map<String, Object>> generatePayrollReport(String payPeriod) {
        return employeeService.findAll().stream().map(emp -> buildPayslip(emp, payPeriod)).toList();
    }

    /**
     * Builds a payslip map for one employee.
     */
    public Map<String, Object> buildPayslip(EmployeeResponse emp, String payPeriod) {
        BigDecimal gross      = emp.getGrossMonthly();
        BigDecimal tax        = gross.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal insurance  = gross.multiply(INSURANCE_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal retirement = gross.multiply(RETIREMENT_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal deductions = tax.add(insurance).add(retirement);
        BigDecimal net        = gross.subtract(deductions);

        Map<String, Object> payslip = new LinkedHashMap<>();
        payslip.put("empId",         emp.getId());
        payslip.put("name",          emp.getFullName());
        payslip.put("department",    emp.getDepartment());
        payslip.put("role",          emp.getRole());
        payslip.put("avatarInitials",emp.getAvatarInitials());
        payslip.put("avatarColor",   emp.getAvatarColor());
        payslip.put("gross",         gross);
        payslip.put("tax",           tax);
        payslip.put("insurance",     insurance);
        payslip.put("retirement",    retirement);
        payslip.put("deductions",    deductions);
        payslip.put("net",           net);
        payslip.put("status",        "INACTIVE".equals(emp.getStatus().name()) ? "On Hold" : "Processed");
        payslip.put("payPeriod",     payPeriod);
        return payslip;
    }

    /** Total monthly payroll cost. */
    public BigDecimal totalMonthlyPayroll() {
        return employeeService.findAll().stream()
                .map(EmployeeResponse::getGrossMonthly)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
