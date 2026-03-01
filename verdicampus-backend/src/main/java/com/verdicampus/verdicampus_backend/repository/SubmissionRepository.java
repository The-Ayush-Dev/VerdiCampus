package com.verdicampus.verdicampus_backend.repository;

import com.verdicampus.verdicampus_backend.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByStudentEmail(String email);
    List<Submission> findAllByOrderBySubmittedAtDesc();
    List<Submission> findByAssignmentId(String assignmentId);
}
