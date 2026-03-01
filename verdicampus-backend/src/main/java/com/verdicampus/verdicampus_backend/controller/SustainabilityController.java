package com.verdicampus.verdicampus_backend.controller;

import com.verdicampus.verdicampus_backend.service.SustainabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/sustainability")
@CrossOrigin(origins = "*")
public class SustainabilityController {

    @Autowired
    private SustainabilityService sustainabilityService;

    @GetMapping("/global")
    public ResponseEntity<Map<String, Object>> getGlobalImpact() {
        return ResponseEntity.ok(sustainabilityService.getGlobalImpact());
    }

    @GetMapping("/student/{email}")
    public ResponseEntity<Map<String, Object>> getStudentImpact(@PathVariable String email) {
        return ResponseEntity.ok(sustainabilityService.getStudentImpact(email));
    }
}
