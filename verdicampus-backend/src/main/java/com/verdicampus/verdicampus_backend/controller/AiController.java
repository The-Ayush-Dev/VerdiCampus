package com.verdicampus.verdicampus_backend.controller;

import com.verdicampus.verdicampus_backend.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping("/chat")
    public Map<String, String> chat(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        String prompt = "You are a helpful Eco-Assistant for VerdiCampus. Answer sustainability questions briefly: "
                + message;
        return Map.of("reply", geminiService.generateResponse(prompt));
    }

    @PostMapping("/summarize")
    public Map<String, String> summarize(@RequestBody Map<String, String> request) {
        String content = request.get("content");
        String prompt = "Summarize this notice in one short easy sentence: " + content;
        return Map.of("summary", geminiService.generateResponse(prompt));
    }

    @PostMapping("/digitize")
    public Map<String, String> digitize(@RequestBody Map<String, String> request) {
        String base64Image = request.get("image");
        String mimeType = request.get("mimeType");
        String prompt = "Transcribe this handwritten journal page into clear digital text. " +
                "Format it as a professional academic record.";
        return Map.of("text", geminiService.generateMultimodalResponse(prompt, base64Image, mimeType));
    }

    @PostMapping("/audit")
    public Map<String, String> audit(@RequestBody Map<String, String> request) {
        String content = request.get("content");
        String prompt = "Analyze this text. How many standard A4 pages would it take if printed " +
                "(12pt font, double spaced)? Return only the number.";
        return Map.of("pages", geminiService.generateResponse(prompt));
    }

    @PostMapping("/map-syllabus")
    public Map<String, String> mapSyllabus(@RequestBody Map<String, String> request) {
        String syllabus = request.get("syllabus");
        String prompt = "Given this syllabus: '" + syllabus + "', recommend 3-5 specific digital textbooks " +
                "or online research topics. Format as a bulleted list.";
        return Map.of("resources", geminiService.generateResponse(prompt));
    }

    @PostMapping("/plan-event")
    public Map<String, String> planEvent(@RequestBody Map<String, String> request) {
        String eventDetails = request.get("event");
        String prompt = "Provide a 5-step ZERO-PAPER strategy for this campus event: " + eventDetails;
        return Map.of("plan", geminiService.generateResponse(prompt));
    }

    @PostMapping("/generate")
    public Map<String, String> generate(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        return Map.of("text", geminiService.generateResponse(prompt));
    }
}
