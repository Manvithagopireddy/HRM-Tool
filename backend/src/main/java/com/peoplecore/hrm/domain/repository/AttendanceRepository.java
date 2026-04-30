package com.peoplecore.hrm.domain.repository;

import com.peoplecore.hrm.domain.model.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<AttendanceRecord, Long> {

    List<AttendanceRecord> findByEmployeeIdOrderByRecordDateDesc(String empId);

    List<AttendanceRecord> findByRecordDateBetween(LocalDate from, LocalDate to);

    boolean existsByEmployeeIdAndRecordDate(String empId, LocalDate date);

    @Query("""
        SELECT a.employee.id, a.status, COUNT(a)
        FROM AttendanceRecord a
        WHERE a.recordDate BETWEEN :from AND :to
        GROUP BY a.employee.id, a.status
        """)
    List<Object[]> summarizeByEmployeeBetween(LocalDate from, LocalDate to);

    @Query("""
        SELECT a.status, COUNT(a) FROM AttendanceRecord a
        WHERE a.recordDate BETWEEN :from AND :to
        GROUP BY a.status
        """)
    List<Object[]> summarizeStatusBetween(LocalDate from, LocalDate to);
}
