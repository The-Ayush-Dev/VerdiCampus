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

    public boolean isApiKeyConfigured() {
        return apiKey != null && !apiKey.isEmpty() && !apiKey.equals("${GEMINI_API_KEY}");
    }

    public String generateResponse(String prompt) {
        return callGemini(prompt, null, null);
    }

    public String generateMultimodalResponse(String prompt, String base64Image, String mimeType) {
        return callGemini(prompt, base64Image, mimeType);
    }

    private String callGemini(String prompt, String base64Image, String mimeType) {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("${GEMINI_API_KEY}")) {
            System.err.println("AI Error: GEMINI_API_KEY environment variable is missing.");
            return "AI Error: API key configuration missing.";
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

            Map<String, Object> response = restTemplate.postForObject(urlWithKey, entity, Map.class);

            if (response == null || !response.containsKey("candidates")) {
                return "AI Error: Invalid response from Gemini.";
            }

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            Map<String, Object> firstCandidate = candidates.get(0);
            Map<String, Object> contentMap = (Map<String, Object>) firstCandidate.get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) contentMap.get("parts");

            return (String) parts.get(0).get("text");

        } catch (org.springframework.web.client.HttpClientErrorException e) {
            System.err.println("AI HTTP Error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            return "AI Error: Connection failed (" + e.getStatusCode() + ")";
        } catch (Exception e) {
            System.err.println("AI General Error: " + e.getMessage());
            return "AI Error: An unexpected error occurred.";
        }
    }
}
