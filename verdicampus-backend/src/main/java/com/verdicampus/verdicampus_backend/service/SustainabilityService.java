package com.verdicampus.verdicampus_backend.service;

import com.verdicampus.verdicampus_backend.model.Submission;
import com.verdicampus.verdicampus_backend.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SustainabilityService {

    @Autowired
    private SubmissionRepository submissionRepository;

    public Map<String, Object> getGlobalImpact() {
        List<Submission> submissions = submissionRepository.findAll();
        int totalSubmissions = submissions.size();
        int totalPagesSaved = submissions.stream().mapToInt(Submission::getPagesSaved).sum();
        
        // 1 sheet of A4 paper ~ 5 grams
        double totalWeightKg = (totalPagesSaved * 5.0) / 1000.0;
        
        // 1 tree produces approx 8,333 sheets of A4 paper
        double treesSaved = (double) totalPagesSaved / 8333.0;
        
        // 1 sheet of paper = ~5g of CO2
        double co2ReducedKg = (totalPagesSaved * 5.0) / 1000.0;

        Map<String, Object> impact = new HashMap<>();
        impact.put("totalSubmissions", totalSubmissions);
        impact.put("totalPagesSaved", totalPagesSaved);
        impact.put("paperWeightSavedKg", totalWeightKg);
        impact.put("treesSaved", treesSaved);
        impact.put("co2ReducedKg", co2ReducedKg);
        
        return impact;
    }

    public Map<String, Object> getStudentImpact(String email) {
        List<Submission> submissions = submissionRepository.findByStudentEmail(email);
        int totalSubmissions = submissions.size();
        int totalPagesSaved = submissions.stream().mapToInt(Submission::getPagesSaved).sum();
        
        double treesSaved = (double) totalPagesSaved / 8333.0;
        double co2ReducedKg = (totalPagesSaved * 5.0) / 1000.0;

        Map<String, Object> impact = new HashMap<>();
        impact.put("totalSubmissions", totalSubmissions);
        impact.put("totalPagesSaved", totalPagesSaved);
        impact.put("treesSaved", treesSaved);
        impact.put("co2ReducedKg", co2ReducedKg);
        
        return impact;
    }
}
