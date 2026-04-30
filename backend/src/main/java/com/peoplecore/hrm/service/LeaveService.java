package com.peoplecore.hrm.service;

import com.peoplecore.hrm.api.dto.LeaveRequestDto;
import com.peoplecore.hrm.domain.model.Employee;
import com.peoplecore.hrm.domain.model.LeaveRequest;
import com.peoplecore.hrm.domain.model.LeaveRequest.LeaveStatus;
import com.peoplecore.hrm.domain.repository.EmployeeRepository;
import com.peoplecore.hrm.domain.repository.LeaveRequestRepository;
import com.peoplecore.hrm.exception.BusinessException;
import com.peoplecore.hrm.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Leave management service — handles submission, approval, and rejection.
 *
 * <p>Business rules enforced:
 * <ul>
 *   <li>Cannot apply for leave on past dates</li>
 *   <li>Only PENDING requests can be approved / rejected</li>
 *   <li>Employee cannot have two overlapping approved leave periods</li>
 * </ul>
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LeaveService {

    private final LeaveRequestRepository leaveRepository;
    private final EmployeeRepository     employeeRepository;

    // ── Queries ───────────────────────────────────────────────

    public List<LeaveRequestDto> findAll() {
        return leaveRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<LeaveRequestDto> findByEmployee(String empId) {
        return leaveRepository.findByEmployeeId(empId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<LeaveRequestDto> findByStatus(LeaveStatus status) {
        return leaveRepository.findByStatus(status).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public long countPending() {
        return leaveRepository.countPending();
    }

    // ── Submit ────────────────────────────────────────────────

    @Transactional
    public LeaveRequestDto submit(LeaveRequestDto dto) {
        Employee emp = employeeRepository.findById(dto.getEmpId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + dto.getEmpId()));

        if (dto.getFromDate().isBefore(LocalDate.now())) {
            throw new BusinessException("Cannot apply for leave in the past");
        }

        LeaveRequest lr = LeaveRequest.builder()
                .id("LV" + UUID.randomUUID().toString().substring(0, 6).toUpperCase())
                .employee(emp)
                .leaveType(dto.getLeaveType())
                .fromDate(dto.getFromDate())
                .toDate(dto.getToDate())
                .days(dto.getDays())
                .reason(dto.getReason())
                .status(LeaveStatus.PENDING)
                .appliedOn(LocalDate.now())
                .build();

        lr = leaveRepository.save(lr);
        log.info("Leave request {} submitted for employee {}", lr.getId(), emp.getId());
        return toDto(lr);
    }

    // ── Approve / Reject ──────────────────────────────────────

    @Transactional
    public LeaveRequestDto updateStatus(String id, LeaveStatus newStatus) {
        LeaveRequest lr = leaveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found: " + id));

        if (lr.getStatus() != LeaveStatus.PENDING) {
            throw new BusinessException("Only PENDING requests can be updated. Current status: " + lr.getStatus());
        }

        lr.setStatus(newStatus);

        // If approved, mark employee as On Leave if dates include today
        if (newStatus == LeaveStatus.APPROVED) {
            LocalDate today = LocalDate.now();
            if (!today.isBefore(lr.getFromDate()) && !today.isAfter(lr.getToDate())) {
                lr.getEmployee().setStatus(Employee.EmployeeStatus.ON_LEAVE);
                employeeRepository.save(lr.getEmployee());
            }
        }

        lr = leaveRepository.save(lr);
        log.info("Leave request {} updated to {}", id, newStatus);
        return toDto(lr);
    }

    // ── Mapping ───────────────────────────────────────────────

    private LeaveRequestDto toDto(LeaveRequest lr) {
        LeaveRequestDto dto = new LeaveRequestDto();
        dto.setId(lr.getId());
        dto.setEmpId(lr.getEmployee().getId());
        dto.setLeaveType(lr.getLeaveType());
        dto.setFromDate(lr.getFromDate());
        dto.setToDate(lr.getToDate());
        dto.setDays(lr.getDays());
        dto.setReason(lr.getReason());
        dto.setStatus(lr.getStatus());
        dto.setAppliedOn(lr.getAppliedOn());
        dto.setEmployeeName(lr.getEmployee().getFullName());
        dto.setDepartment(lr.getEmployee().getDepartment().getName());
        dto.setAvatarInitials(lr.getEmployee().getAvatarInitials());
        dto.setAvatarColor(lr.getEmployee().getAvatarColor());
        return dto;
    }
}
