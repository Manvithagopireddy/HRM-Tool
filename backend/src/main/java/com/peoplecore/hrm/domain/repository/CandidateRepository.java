package com.peoplecore.hrm.domain.repository;

import com.peoplecore.hrm.domain.model.Candidate;
import com.peoplecore.hrm.domain.model.Candidate.CandidateStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, String> {

    List<Candidate> findByJobId(String jobId);

    List<Candidate> findByStage(CandidateStage stage);

    @Query("SELECT c.stage, COUNT(c) FROM Candidate c GROUP BY c.stage")
    List<Object[]> countByStage();
}
