package com.verdicampus.verdicampus_backend.service;

import com.verdicampus.verdicampus_backend.model.Submission;
import com.verdicampus.verdicampus_backend.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    public Submission submitProject(Submission submission) {
        return submissionRepository.save(submission);
    }

    public List<Submission> getSubmissionsByStudent(String email) {
        return submissionRepository.findByStudentEmail(email);
    }

    public List<Submission> getAllSubmissions() {
        return submissionRepository.findAllByOrderBySubmittedAtDesc();
    }

    public Submission updateGrade(Long id, String grade) {
        Optional<Submission> submission = submissionRepository.findById(id);
        if (submission.isPresent()) {
            submission.get().setGrade(grade);
            submission.get().setStatus("Graded");
            return submissionRepository.save(submission.get());
        }
        return null;
    }
}
