package com.verdicampus.verdicampus_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateResponse(String prompt) {
        return callGemini(prompt, null, null);
    }

    public String generateMultimodalResponse(String prompt, String base64Image, String mimeType) {
        return callGemini(prompt, base64Image, mimeType);
    }

    private String callGemini(String prompt, String base64Image, String mimeType) {
        System.out.println("AI Request Prompt: " + prompt.substring(0, Math.min(prompt.length(), 100)) + "...");
        
        if (apiKey == null || apiKey.isEmpty() || "REPLACE_WITH_YOUR_GEMINI_API_KEY".equals(apiKey)) {
            System.err.println("AI Error: Gemini API Key is missing or invalid!");
            return "AI Service: Please provide a valid Gemini API Key.";
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> textPart = new HashMap<>();
            textPart.put("text", prompt);

            Map<String, Object> content = new HashMap<>();
            
            if (base64Image != null) {
                Map<String, Object> imagePart = new HashMap<>();
                Map<String, String> inlineData = new HashMap<>();
                inlineData.put("mime_type", mimeType);
                inlineData.put("data", base64Image.contains(",") ? base64Image.split(",")[1] : base64Image);
                imagePart.put("inline_data", inlineData);
                content.put("parts", List.of(textPart, imagePart));
            } else {
                content.put("parts", List.of(textPart));
            }

            Map<String, Object> payload = new HashMap<>();
            payload.put("contents", List.of(content));

            String urlWithKey = apiUrl + "?key=" + apiKey;
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            System.out.println("Calling Gemini API at: " + apiUrl);
            Map<String, Object> response = restTemplate.postForObject(urlWithKey, entity, Map.class);
            
            if (response == null || !response.containsKey("candidates")) {
                System.err.println("AI Error: Unexpected response format from Gemini");
                return "AI Error: Unexpected response from Gemini API";
            }

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            Map<String, Object> firstCandidate = candidates.get(0);
            Map<String, Object> contentMap = (Map<String, Object>) firstCandidate.get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) contentMap.get("parts");
            
            String result = (String) parts.get(0).get("text");
            System.out.println("AI Response Success (Length: " + result.length() + ")");
            return result;

        } catch (org.springframework.web.client.HttpClientErrorException e) {
            System.err.println("AI HTTP Error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            return "AI Error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString();
        } catch (Exception e) {
            System.err.println("AI General Error: " + e.getMessage());
            e.printStackTrace();
            return "AI Error: " + e.getMessage();
        }
    }
}
