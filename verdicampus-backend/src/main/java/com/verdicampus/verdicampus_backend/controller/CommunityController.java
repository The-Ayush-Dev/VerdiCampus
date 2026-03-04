package com.verdicampus.verdicampus_backend.controller;

import com.verdicampus.verdicampus_backend.model.CommunityPost;
import com.verdicampus.verdicampus_backend.repository.CommunityPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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
        post.setId(null); // Ensure it's treated as a new entity
        post.setCreatedAt(LocalDateTime.now());
        post.setLikes(0);
        CommunityPost saved = communityPostRepository.save(post);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/posts/{id}/like")
    public ResponseEntity<CommunityPost> likePost(@PathVariable Long id) {
        Optional<CommunityPost> optionalPost = communityPostRepository.findById(id);
        if (optionalPost.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        CommunityPost post = optionalPost.get();
        post.setLikes(post.getLikes() + 1);
        communityPostRepository.save(post);
        return ResponseEntity.ok(post);
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        communityPostRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
