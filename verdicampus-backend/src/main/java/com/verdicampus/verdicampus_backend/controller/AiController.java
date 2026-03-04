package com.verdicampus.verdicampus_backend.controller;

import com.verdicampus.verdicampus_backend.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AiController {

    @Autowired
    private GeminiService geminiService;

    @GetMapping("/check-key")
    public Map<String, String> checkKey() {
        boolean exists = geminiService.isApiKeyConfigured();
        return Map.of("status", exists ? "Key found" : "Key NOT found");
    }

    @GetMapping("/health")
    public String health() {
        return "Server running";
    }

    @PostMapping("/chat")
    public Map<String, Object> chat(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");

        if (userMessage == null || userMessage.trim().isEmpty()) {
            return Map.of("success", false, "message", "Message content is required.");
        }

        try {
            String prompt = "You are a helpful Eco-Assistant for VerdiCampus. Answer sustainability questions briefly: "
                    + userMessage;
            String aiResponse = geminiService.generateResponse(prompt);

            if (aiResponse.startsWith("AI Error")) {
                return Map.of("success", false, "message", "AI Service Error: " + aiResponse);
            }

            return Map.of("success", true, "message", aiResponse);
        } catch (Exception e) {
            return Map.of("success", false, "message", "Internal Server Error: " + e.getMessage());
        }
    }

    @PostMapping("/summarize")
    public Map<String, Object> summarize(@RequestBody Map<String, String> request) {
        String content = request.get("content");
        if (content == null || content.trim().isEmpty()) {
            return Map.of("summary", "No content provided to summarize.");
        }
        try {
            String prompt = "Summarize this notice in one short easy sentence: " + content;
            String result = geminiService.generateResponse(prompt);
            if (result.startsWith("AI Error")) {
                return Map.of("summary", "AI summary unavailable. Please read the full text.");
            }
            return Map.of("summary", result);
        } catch (Exception e) {
            return Map.of("summary", "AI summary unavailable. Please try again later.");
        }
    }

    @PostMapping("/digitize")
    public Map<String, Object> digitize(@RequestBody Map<String, String> request) {
        String base64Image = request.get("image");
        String mimeType = request.get("mimeType");
        String prompt = "Transcribe this handwritten journal page into clear digital text. Format it as a professional academic record.";
        return Map.of("text", geminiService.generateMultimodalResponse(prompt, base64Image, mimeType));
    }

    @PostMapping("/audit")
    public Map<String, Object> audit(@RequestBody Map<String, String> request) {
        String content = request.get("content");
        String prompt = "Analyze this text. How many standard A4 pages would it take if printed (12pt font, double spaced)? Return only the number.";
        return Map.of("pages", geminiService.generateResponse(prompt));
    }

    @PostMapping("/map-syllabus")
    public Map<String, Object> mapSyllabus(@RequestBody Map<String, String> request) {
        String syllabus = request.get("syllabus");
        String prompt = "Given this syllabus: '" + syllabus
                + "', recommend 3-5 specific digital textbooks or online research topics. Format as a bulleted list.";
        return Map.of("resources", geminiService.generateResponse(prompt));
    }

    @PostMapping("/plan-event")
    public Map<String, Object> planEvent(@RequestBody Map<String, String> request) {
        String eventDetails = request.get("event");
        String prompt = "Provide a 5-step ZERO-PAPER strategy for this campus event: " + eventDetails;
        return Map.of("plan", geminiService.generateResponse(prompt));
    }

    @PostMapping("/generate")
    public Map<String, Object> generate(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        return Map.of("text", geminiService.generateResponse(prompt));
    }
}
