package com.voto_safe.voto_safe.backend.controller;

import com.voto_safe.voto_safe.backend.dto.ChatDtos.ChatRequest;
import com.voto_safe.voto_safe.backend.dto.ChatDtos.ChatResponse;
import com.voto_safe.voto_safe.backend.service.ChatService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/chat") // 👈 Coincide con Frontend
@CrossOrigin(origins = "http://localhost:5173") // 👈 Permite React
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/send") // 👈 Coincide con Frontend (POST)
    public Map<String, String> generate(@RequestBody ChatRequest request) {
        
        String userMessage = request.getMessage();
        
        // Llamamos al servicio (que ahora tiene try-catch)
        String aiResponse = chatService.generateResponse(userMessage);
        
        // Devolvemos JSON { "response": "..." }
        return Map.of("response", aiResponse);
    }
}