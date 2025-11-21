// Endpoint para la IA
package com.voto_safe.voto_safe.backend.controller;

import com.voto_safe.voto_safe.backend.service.ChatService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    // Endpoint: GET http://localhost:8080/api/chat/generate?message=Hola
    @GetMapping("/generate")
    public Map<String, String> generate(@RequestParam(value = "message", defaultValue = "Hola") String message) {
        String response = chatService.generateResponse(message);
        // Devolvemos un JSON simple
        return Map.of("response", response);
    }
}