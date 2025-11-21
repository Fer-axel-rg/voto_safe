// Lógica de Spring AI
package com.voto_safe.voto_safe.backend.service;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final ChatModel chatModel;

    // Spring inyectará automáticamente OllamaChatModel aquí gracias a tu pom.xml
    public ChatService(ChatModel chatModel) {
        this.chatModel = chatModel;
    }

    public String generateResponse(String message) {
        // Llama a la IA y obtiene solo el contenido de texto de la respuesta
        return chatModel.call(message);
    }
}