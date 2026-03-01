package com.verdicampus.verdicampus_backend.service;

import com.verdicampus.verdicampus_backend.model.Assignment;
import com.verdicampus.verdicampus_backend.repository.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    public Assignment createAssignment(Assignment assignment) {
        return assignmentRepository.save(assignment);
    }

    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAllByOrderByDueDateAsc();
    }

    public List<Assignment> getAssignmentsByTeacher(String email) {
        return assignmentRepository.findByTeacherEmail(email);
    }

    public void deleteAssignment(Long id) {
        assignmentRepository.deleteById(id);
    }
}
