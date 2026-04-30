package com.peoplecore.hrm.service;

import com.peoplecore.hrm.api.dto.EmployeeRequest;
import com.peoplecore.hrm.api.dto.EmployeeResponse;
import com.peoplecore.hrm.domain.model.Department;
import com.peoplecore.hrm.domain.model.Employee;
import com.peoplecore.hrm.domain.repository.DepartmentRepository;
import com.peoplecore.hrm.domain.repository.EmployeeRepository;
import com.peoplecore.hrm.exception.ResourceNotFoundException;
import com.peoplecore.hrm.exception.DuplicateResourceException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Employee service — full CRUD + payroll computation.
 *
 * <p>Tax model applied (simplified US):
 * <ul>
 *   <li>22% federal income tax</li>
 *   <li>4% health insurance</li>
 *   <li>3% 401-k contribution</li>
 * </ul>
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmployeeService {

    private static final BigDecimal TAX_RATE        = new BigDecimal("0.22");
    private static final BigDecimal INSURANCE_RATE  = new BigDecimal("0.04");
    private static final BigDecimal RETIREMENT_RATE = new BigDecimal("0.03");

    private final EmployeeRepository   employeeRepository;
    private final DepartmentRepository departmentRepository;

    // ── Queries ───────────────────────────────────────────────

    public List<EmployeeResponse> findAll() {
        return employeeRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public EmployeeResponse findById(String id) {
        return toResponse(getEmployee(id));
    }

    public List<EmployeeResponse> findByDepartment(Long deptId) {
        return employeeRepository.findByDepartmentId(deptId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<EmployeeResponse> findByStatus(Employee.EmployeeStatus status) {
        return employeeRepository.findByStatus(status)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── Mutations ─────────────────────────────────────────────

    @Transactional
    public EmployeeResponse create(EmployeeRequest req) {
        if (employeeRepository.existsById(req.getId())) {
            throw new DuplicateResourceException("Employee ID already exists: " + req.getId());
        }
        if (employeeRepository.existsByEmail(req.getEmail())) {
            throw new DuplicateResourceException("Email already in use: " + req.getEmail());
        }

        Department dept = getDept(req.getDepartmentId());
        Employee   emp  = fromRequest(req, dept);
        emp = employeeRepository.save(emp);
        log.info("Created employee {}", emp.getId());
        return toResponse(emp);
    }

    @Transactional
    public EmployeeResponse update(String id, EmployeeRequest req) {
        Employee emp  = getEmployee(id);
        Department dept = getDept(req.getDepartmentId());

        // detect email change collision
        if (!emp.getEmail().equalsIgnoreCase(req.getEmail())
                && employeeRepository.existsByEmail(req.getEmail())) {
            throw new DuplicateResourceException("Email already in use: " + req.getEmail());
        }

        applyRequest(emp, req, dept);
        emp = employeeRepository.save(emp);
        log.info("Updated employee {}", id);
        return toResponse(emp);
    }

    @Transactional
    public void delete(String id) {
        if (!employeeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Employee not found: " + id);
        }
        employeeRepository.deleteById(id);
        log.info("Deleted employee {}", id);
    }

    // ── Payroll helper ────────────────────────────────────────

    public BigDecimal computeGrossMonthly(BigDecimal annualSalary) {
        return annualSalary.divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);
    }

    public BigDecimal computeNetMonthly(BigDecimal grossMonthly) {
        BigDecimal tax        = grossMonthly.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal insurance  = grossMonthly.multiply(INSURANCE_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal retirement = grossMonthly.multiply(RETIREMENT_RATE).setScale(2, RoundingMode.HALF_UP);
        return grossMonthly.subtract(tax).subtract(insurance).subtract(retirement);
    }

    // ── Private helpers ───────────────────────────────────────

    private Employee getEmployee(String id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));
    }

    private Department getDept(Long deptId) {
        return departmentRepository.findById(deptId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + deptId));
    }

    private Employee fromRequest(EmployeeRequest req, Department dept) {
        return Employee.builder()
                .id(req.getId())
                .empCode(req.getId())
                .fullName(req.getFullName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .role(req.getRole())
                .department(dept)
                .location(req.getLocation())
                .salary(req.getSalary())
                .status(req.getStatus() != null ? req.getStatus() : Employee.EmployeeStatus.ACTIVE)
                .joinDate(req.getJoinDate())
                .avatarInitials(req.getAvatarInitials())
                .avatarColor(req.getAvatarColor())
                .managerName(req.getManagerName())
                .employmentType(req.getEmploymentType())
                .performanceScore(req.getPerformanceScore())
                .gender(req.getGender())
                .age(req.getAge())
                .build();
    }

    private void applyRequest(Employee emp, EmployeeRequest req, Department dept) {
        emp.setFullName(req.getFullName());
        emp.setEmail(req.getEmail());
        emp.setPhone(req.getPhone());
        emp.setRole(req.getRole());
        emp.setDepartment(dept);
        emp.setLocation(req.getLocation());
        emp.setSalary(req.getSalary());
        if (req.getStatus() != null) emp.setStatus(req.getStatus());
        emp.setJoinDate(req.getJoinDate());
        emp.setAvatarInitials(req.getAvatarInitials());
        emp.setAvatarColor(req.getAvatarColor());
        emp.setManagerName(req.getManagerName());
        emp.setEmploymentType(req.getEmploymentType());
        emp.setPerformanceScore(req.getPerformanceScore());
        emp.setGender(req.getGender());
        emp.setAge(req.getAge());
    }

    /**
     * Maps an {@link Employee} entity to an {@link EmployeeResponse} DTO,
     * including computed monthly payroll figures.
     */
    public EmployeeResponse toResponse(Employee emp) {
        EmployeeResponse r = new EmployeeResponse();
        r.setId(emp.getId());
        r.setEmpCode(emp.getEmpCode());
        r.setFullName(emp.getFullName());
        r.setEmail(emp.getEmail());
        r.setPhone(emp.getPhone());
        r.setRole(emp.getRole());
        r.setDepartment(emp.getDepartment().getName());
        r.setDepartmentId(emp.getDepartment().getId());
        r.setLocation(emp.getLocation());
        r.setSalary(emp.getSalary());
        r.setStatus(emp.getStatus());
        r.setJoinDate(emp.getJoinDate());
        r.setAvatarInitials(emp.getAvatarInitials());
        r.setAvatarColor(emp.getAvatarColor());
        r.setManagerName(emp.getManagerName());
        r.setEmploymentType(emp.getEmploymentType());
        r.setPerformanceScore(emp.getPerformanceScore());
        r.setGender(emp.getGender());
        r.setAge(emp.getAge());

        BigDecimal gross = computeGrossMonthly(emp.getSalary());
        r.setGrossMonthly(gross);
        r.setNetMonthly(computeNetMonthly(gross));
        return r;
    }
}
