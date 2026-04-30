package com.peoplecore.hrm.api.dto;

import com.peoplecore.hrm.domain.model.LeaveRequest;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

/** DTO for submitting a leave request. */
@Data
public class LeaveRequestDto {

    private String id;

    @NotBlank
    private String empId;

    @NotNull
    private LeaveRequest.LeaveType leaveType;

    @NotNull
    private LocalDate fromDate;

    @NotNull
    private LocalDate toDate;

    @Positive
    private Integer days;

    private String reason;
    private LeaveRequest.LeaveStatus status;
    private LocalDate appliedOn;

    // flattened employee fields for the response
    private String employeeName;
    private String department;
    private String avatarInitials;
    private String avatarColor;
}
