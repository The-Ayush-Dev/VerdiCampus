package com.verdicampus.verdicampus_backend.repository;

import com.verdicampus.verdicampus_backend.model.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByTeacherEmail(String email);
    List<Assignment> findAllByOrderByDueDateAsc();
}
