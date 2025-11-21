//Configurar JWT de Supabase
package com.voto_safe.voto_safe.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Desactivamos CSRF porque es una API pública para tu frontend
                .csrf(csrf -> csrf.disable())
                // Configuramos los permisos
                .authorizeHttpRequests(auth -> auth
                        // ¡IMPORTANTE! Permitimos acceso total a las rutas del chat
                        .requestMatchers("/api/chat/**").permitAll()
                        // Para facilitar las pruebas, permitimos todo por ahora
                        .anyRequest().permitAll()
                );

        return http.build();
    }
}