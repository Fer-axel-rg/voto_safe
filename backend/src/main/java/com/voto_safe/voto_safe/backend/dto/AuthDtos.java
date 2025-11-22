package com.voto_safe.voto_safe.backend.dto;

// ✅ CLASE PADRE (Coincide con el nombre del archivo)
public class AuthDtos {

    // ✅ CLASES HIJAS (Estáticas y anidadas)
    // Al ponerlas aquí dentro, Java ya no se queja.

    public static class LoginRequest {
        private String id;
        private String password;

        // Getters y Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
public static class UserDTO {
        private String id;
        private String names;    // Nuevo: Solo nombres
        private String surnames; // Nuevo: Solo apellidos
        private String fullName; // Mantenemos este por si acaso
        private String email;
        private String role;
        private String department;
        private String createdAt;

        public UserDTO(String id, String names, String surnames, String email, String role, String department, String createdAt) {
            this.id = id;
            this.names = names;
            this.surnames = surnames;
            this.fullName = names + " " + surnames;
            this.email = email;
            this.role = role;
            this.department = department;
            this.createdAt = createdAt;
        }
        // Getters
        public String getId() { return id; }
        public String getNames() { return names; }       // <--- Getter Nuevo
        public String getSurnames() { return surnames; } // <--- Getter Nuevo
        public String getFullName() { return fullName; }
        public String getEmail() { return email; }
        public String getRole() { return role; }
        public String getDepartment() { return department; }
        public String getCreatedAt() { return createdAt; }
    }

    public static class AuthResponse {
        private boolean success;
        private String message;
        private String token;
        private UserDTO user;

        public AuthResponse(boolean success, String message, String token, UserDTO user) {
            this.success = success;
            this.message = message;
            this.token = token;
            this.user = user;
        }
        // Getters
        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public String getToken() { return token; }
        public UserDTO getUser() { return user; }
    }
}