package com.peoplecore.hrm.domain.repository;

import com.peoplecore.hrm.domain.model.Job;
import com.peoplecore.hrm.domain.model.Job.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, String> {

    List<Job> findByStatus(JobStatus status);

    List<Job> findByDepartmentId(Long departmentId);

    @Query("SELECT SUM(j.applications) FROM Job j WHERE j.status = 'OPEN'")
    Long sumOpenApplications();
}
