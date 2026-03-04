package com.verdicampus.verdicampus_backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "community_posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CommunityPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String authorName;

    private String authorEmail;

    private String authorRole; // STUDENT or TEACHER

    private String type; // DISCUSSION, EVENT, IDEA

    @Column(columnDefinition = "TEXT")
    private String content;

    private String tags;

    private int likes;

    private LocalDateTime createdAt = LocalDateTime.now();
}
