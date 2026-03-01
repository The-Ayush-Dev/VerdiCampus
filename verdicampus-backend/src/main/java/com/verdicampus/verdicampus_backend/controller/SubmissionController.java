package com.verdicampus.verdicampus_backend.controller;

import com.verdicampus.verdicampus_backend.model.Submission;
import com.verdicampus.verdicampus_backend.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "*")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    @PostMapping
    public ResponseEntity<Submission> createSubmission(@RequestBody Submission submission) {
        return ResponseEntity.ok(submissionService.submitProject(submission));
    }

    @GetMapping("/student/{email}")
    public List<Submission> getStudentSubmissions(@PathVariable String email) {
        return submissionService.getSubmissionsByStudent(email);
    }

    @GetMapping
    public List<Submission> getAllSubmissions() {
        return submissionService.getAllSubmissions();
    }

    @PatchMapping("/{id}/grade")
    public ResponseEntity<Submission> gradeSubmission(@PathVariable Long id, @RequestBody Map<String, String> gradeData) {
        String grade = gradeData.get("grade");
        return ResponseEntity.ok(submissionService.updateGrade(id, grade));
    }
}
