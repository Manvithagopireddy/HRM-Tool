package com.peoplecore.hrm.domain.repository;

import com.peoplecore.hrm.domain.model.LeaveRequest;
import com.peoplecore.hrm.domain.model.LeaveRequest.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, String> {

    List<LeaveRequest> findByEmployeeId(String employeeId);

    List<LeaveRequest> findByStatus(LeaveStatus status);

    @Query("SELECT COUNT(l) FROM LeaveRequest l WHERE l.status = 'PENDING'")
    long countPending();

    @Query("SELECT l.leaveType, COUNT(l) FROM LeaveRequest l GROUP BY l.leaveType")
    List<Object[]> countByLeaveType();
}
