// Lógica de Spring AI
package com.voto_safe.voto_safe.backend.service;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    // Inyectamos ChatModel (Puede fallar si no tienes la dependencia en pom.xml)
    private final ChatModel chatModel;

    public ChatService(ChatModel chatModel) {
        this.chatModel = chatModel;
    }

    public String generateResponse(String message) {
        try {
            // Intentamos llamar a la IA real (Ollama)
            return chatModel.call(message);
        } catch (Exception e) {
            // SI FALLA (Ollama apagado), respondemos esto para no romper el Chat
            System.err.println("⚠️ Error conectando con Ollama: " + e.getMessage());
            return "Lo siento, mi cerebro de IA (Ollama) está desconectado. " +
                   "Soy el modo de respaldo: Recibí tu mensaje: " + message;
        }
    }
}
