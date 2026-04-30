package com.peoplecore.hrm.service;

import com.peoplecore.hrm.domain.model.Candidate;
import com.peoplecore.hrm.domain.model.Candidate.CandidateStage;
import com.peoplecore.hrm.domain.model.Job;
import com.peoplecore.hrm.domain.repository.CandidateRepository;
import com.peoplecore.hrm.domain.repository.JobRepository;
import com.peoplecore.hrm.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Recruitment service — manages job postings and candidate pipelines.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecruitmentService {

    private final JobRepository       jobRepository;
    private final CandidateRepository candidateRepository;

    // ── Jobs ─────────────────────────────────────────────────

    public List<Job> findAllJobs() {
        return jobRepository.findAll();
    }

    public List<Job> findOpenJobs() {
        return jobRepository.findByStatus(Job.JobStatus.OPEN);
    }

    @Transactional
    public Job createJob(Job job) {
        return jobRepository.save(job);
    }

    @Transactional
    public Job updateJobStatus(String jobId, Job.JobStatus status) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found: " + jobId));
        job.setStatus(status);
        return jobRepository.save(job);
    }

    // ── Candidates ────────────────────────────────────────────

    public List<Candidate> findAllCandidates() {
        return candidateRepository.findAll();
    }

    public List<Candidate> findCandidatesForJob(String jobId) {
        return candidateRepository.findByJobId(jobId);
    }

    /**
     * Advances a candidate to the next stage in the Kanban pipeline.
     *
     * @param candidateId target candidate ID
     * @param newStage    the stage to move to
     */
    @Transactional
    public Candidate moveCandidate(String candidateId, CandidateStage newStage) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found: " + candidateId));
        candidate.setStage(newStage);
        candidateRepository.save(candidate);
        log.info("Candidate {} moved to stage {}", candidateId, newStage);
        return candidate;
    }

    /** Returns a map of stage → count for the funnel chart. */
    public Map<String, Long> getCandidateFunnelStats() {
        return candidateRepository.countByStage().stream()
                .collect(Collectors.toMap(
                        r -> r[0].toString(),
                        r -> (Long) r[1]
                ));
    }
}
