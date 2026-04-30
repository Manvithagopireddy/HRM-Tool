package com.peoplecore.hrm.domain.repository;

import com.peoplecore.hrm.domain.model.Employee;
import com.peoplecore.hrm.domain.model.Employee.EmployeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Employee repository — provides rich query methods beyond the standard CRUD.
 */
@Repository
public interface EmployeeRepository
        extends JpaRepository<Employee, String>, JpaSpecificationExecutor<Employee> {

    Optional<Employee> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Employee> findByStatus(EmployeeStatus status);

    List<Employee> findByDepartmentId(Long departmentId);

    /** Count employees grouped by department. */
    @Query("SELECT e.department.name, COUNT(e) FROM Employee e GROUP BY e.department.name")
    List<Object[]> countByDepartment();

    /** Sum of all salaries — used for payroll overview. */
    @Query("SELECT COALESCE(SUM(e.salary), 0) FROM Employee e WHERE e.status <> 'INACTIVE'")
    BigDecimal sumActiveSalaries();

    /** Average performance score across all employees. */
    @Query("SELECT AVG(e.performanceScore) FROM Employee e WHERE e.performanceScore IS NOT NULL")
    Double avgPerformanceScore();

    /** Employees whose salary falls within a band. */
    @Query("SELECT e FROM Employee e WHERE e.salary >= :minSal AND e.salary < :maxSal")
    List<Employee> findBySalaryBand(BigDecimal minSal, BigDecimal maxSal);
}
