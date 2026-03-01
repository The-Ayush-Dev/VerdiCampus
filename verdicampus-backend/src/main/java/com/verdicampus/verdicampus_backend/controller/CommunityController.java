package com.verdicampus.verdicampus_backend.controller;

import com.verdicampus.verdicampus_backend.model.CommunityPost;
import com.verdicampus.verdicampus_backend.repository.CommunityPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/community")
@CrossOrigin(origins = "*")
public class CommunityController {

    @Autowired
    private CommunityPostRepository communityPostRepository;

    @GetMapping("/posts")
    public List<CommunityPost> getAllPosts() {
        return communityPostRepository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping("/posts")
    public ResponseEntity<CommunityPost> createPost(@RequestBody CommunityPost post) {
        post.setCreatedAt(LocalDateTime.now());
        CommunityPost saved = communityPostRepository.save(post);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        communityPostRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
