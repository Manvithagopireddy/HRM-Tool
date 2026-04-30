package com.peoplecore.hrm.api.controller;

import com.peoplecore.hrm.api.dto.EmployeeRequest;
import com.peoplecore.hrm.api.dto.EmployeeResponse;
import com.peoplecore.hrm.domain.model.Employee;
import com.peoplecore.hrm.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Employee REST controller.
 *
 * <pre>
 *   GET    /api/employees              — list all
 *   GET    /api/employees/{id}         — get one
 *   GET    /api/employees?status=ACTIVE — filter by status
 *   GET    /api/employees?deptId=1      — filter by department
 *   POST   /api/employees              — create  (HR_MANAGER only)
 *   PUT    /api/employees/{id}         — full update
 *   DELETE /api/employees/{id}         — delete  (HR_MANAGER only)
 * </pre>
 */
@RestController
@RequestMapping("/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<List<EmployeeResponse>> list(
            @RequestParam(required = false) Employee.EmployeeStatus status,
            @RequestParam(required = false) Long deptId) {

        List<EmployeeResponse> result;
        if (status != null) {
            result = employeeService.findByStatus(status);
        } else if (deptId != null) {
            result = employeeService.findByDepartment(deptId);
        } else {
            result = employeeService.findAll();
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> getOne(@PathVariable String id) {
        return ResponseEntity.ok(employeeService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('HR_MANAGER')")
    public ResponseEntity<EmployeeResponse> create(@Valid @RequestBody EmployeeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(employeeService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('HR_MANAGER')")
    public ResponseEntity<EmployeeResponse> update(
            @PathVariable String id,
            @Valid @RequestBody EmployeeRequest request) {
        return ResponseEntity.ok(employeeService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('HR_MANAGER')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        employeeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
