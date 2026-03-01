package com.verdicampus.verdicampus_backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentEmail;

    private String studentName;

    private String assignmentId;

    private String assignmentTitle;

    private String fileName;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String fileData;

    private String fileType;

    private String status = "Submitted";

    private String grade;

    private String feedback;

    private LocalDateTime submittedAt = LocalDateTime.now();

    private int pagesSaved = 5;
}
