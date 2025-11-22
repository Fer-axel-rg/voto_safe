package com.voto_safe.voto_safe.backend.dto;


public class ChatDtos {

    // 1. LO QUE RECIBIMOS DESDE REACT
    // React envía: { "message": "Hola IA" }
    public static class ChatRequest {
        private String message;

        // Getters y Setters (NECESARIOS)
        public String getMessage() { 
            return message; 
        }
        
        public void setMessage(String message) { 
            this.message = message; 
        }
    }

    // 2. LO QUE RESPONDEMOS (Opcional, si usas objetos en vez de Map)
    public static class ChatResponse {
        private String response;

        public ChatResponse(String response) {
            this.response = response;
        }

        public String getResponse() { 
            return response; 
        }
        
        public void setResponse(String response) { 
            this.response = response; 
        }
    }
}