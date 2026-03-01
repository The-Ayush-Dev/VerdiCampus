package com.verdicampus.verdicampus_backend.controller;

import com.verdicampus.verdicampus_backend.model.User;
import com.verdicampus.verdicampus_backend.security.JwtUtil;
import com.verdicampus.verdicampus_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allows requests from React/Flutter
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.ok(registeredUser);
        } catch (Exception e) {
            System.err.println("Registration error: " + e.getMessage());
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
        try {
            String email = loginRequest.get("email");
            String password = loginRequest.get("password");

            Optional<User> user = userService.findByEmail(email);

            if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
                String token = jwtUtil.generateToken(email);
                Map<String, String> response = new HashMap<>();
                response.put("token", token);
                response.put("email", email);
                response.put("role", user.get().getRole());
                response.put("department", user.get().getDepartment());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(401).body("Invalid email or password");
            }
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            return ResponseEntity.status(500).body("Database Error: " + e.getMessage());
        }
    }
}
