package com.peoplecore.hrm.api.controller;

import com.peoplecore.hrm.domain.model.Candidate;
import com.peoplecore.hrm.domain.model.Candidate.CandidateStage;
import com.peoplecore.hrm.domain.model.Job;
import com.peoplecore.hrm.service.RecruitmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Recruitment REST controller.
 *
 * <pre>
 *   GET   /api/recruitment/jobs                — all jobs
 *   GET   /api/recruitment/jobs/open           — open jobs
 *   POST  /api/recruitment/jobs                — create job
 *   PATCH /api/recruitment/jobs/{id}/status    — update job status
 *   GET   /api/recruitment/candidates          — all candidates
 *   GET   /api/recruitment/candidates/job/{id} — by job
 *   PATCH /api/recruitment/candidates/{id}/stage — move stage
 *   GET   /api/recruitment/stats               — funnel stats
 * </pre>
 */
@RestController
@RequestMapping("/recruitment")
@RequiredArgsConstructor
public class RecruitmentController {

    private final RecruitmentService recruitmentService;

    // ── Jobs ─────────────────────────────────────────────────

    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> allJobs() {
        return ResponseEntity.ok(recruitmentService.findAllJobs());
    }

    @GetMapping("/jobs/open")
    public ResponseEntity<List<Job>> openJobs() {
        return ResponseEntity.ok(recruitmentService.findOpenJobs());
    }

    @PostMapping("/jobs")
    public ResponseEntity<Job> createJob(@RequestBody Job job) {
        return ResponseEntity.ok(recruitmentService.createJob(job));
    }

    @PatchMapping("/jobs/{id}/status")
    public ResponseEntity<Job> updateJobStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        Job.JobStatus status = Job.JobStatus.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(recruitmentService.updateJobStatus(id, status));
    }

    // ── Candidates ────────────────────────────────────────────

    @GetMapping("/candidates")
    public ResponseEntity<List<Candidate>> allCandidates() {
        return ResponseEntity.ok(recruitmentService.findAllCandidates());
    }

    @GetMapping("/candidates/job/{jobId}")
    public ResponseEntity<List<Candidate>> byJob(@PathVariable String jobId) {
        return ResponseEntity.ok(recruitmentService.findCandidatesForJob(jobId));
    }

    @PatchMapping("/candidates/{id}/stage")
    public ResponseEntity<Candidate> moveStage(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        CandidateStage stage = CandidateStage.valueOf(body.get("stage").toUpperCase());
        return ResponseEntity.ok(recruitmentService.moveCandidate(id, stage));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> funnelStats() {
        return ResponseEntity.ok(recruitmentService.getCandidateFunnelStats());
    }
}
