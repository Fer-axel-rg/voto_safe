package com.voto_safe.voto_safe.backend.controller;

import com.voto_safe.voto_safe.backend.dto.AuthDtos.AuthResponse;
import com.voto_safe.voto_safe.backend.dto.AuthDtos.LoginRequest;
import com.voto_safe.voto_safe.backend.dto.AuthDtos.UserDTO;

import com.voto_safe.voto_safe.backend.model.entity.*;
import com.voto_safe.voto_safe.backend.repository.UsuarioRepository;
import com.voto_safe.voto_safe.backend.service.ReniecService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:5173") 
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ReniecService reniecService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            String dniSolicitado = request.getId();
            System.out.println("🔐 Intento de login con DNI: " + dniSolicitado);

            // PASO 1: Buscar en BD local
            Optional<Usuario> usuarioOpt = usuarioRepository.findByDni(dniSolicitado);
            Usuario usuarioFinal;

            if (usuarioOpt.isPresent()) {
                // ✅ Usuario YA EXISTE
                usuarioFinal = usuarioOpt.get();
                System.out.println("✅ Usuario encontrado: " + usuarioFinal.getNombres());
                System.out.println("   id_usuario: " + usuarioFinal.getIdUsuario());
                
            } else {
                // ✅ Usuario NUEVO - Consultar RENIEC y guardar
                System.out.println("⚠️ Usuario nuevo. Consultando RENIEC...");
                
                Usuario usuarioReniec = reniecService.obtenerDatosReniec(dniSolicitado);
                if (usuarioReniec == null) {
                    return ResponseEntity.status(404)
                            .body(new AuthResponse(false, "DNI no válido", null, null));
                }

                // ✅ CRÍTICO: Asignar id_usuario = DNI antes de guardar
                usuarioReniec.setIdUsuario(dniSolicitado);
                usuarioReniec.setDni(dniSolicitado);

                // Guardar nuevo usuario
                try {
                    usuarioFinal = usuarioRepository.save(usuarioReniec);
                    System.out.println("✅ Nuevo usuario guardado: " + usuarioFinal.getNombres());
                    System.out.println("   id_usuario: " + usuarioFinal.getIdUsuario());
                } catch (Exception e) {
                    if (e.getMessage().contains("duplicate key")) {
                        // Otro proceso ya lo guardó, buscar de nuevo
                        usuarioFinal = usuarioRepository.findByDni(dniSolicitado)
                                .orElseThrow(() -> new RuntimeException("Error de concurrencia"));
                    } else {
                        throw e;
                    }
                }
            }

            // ✅ PASO 2: Crear respuesta con id_usuario (no DNI)
            UserDTO userDto = new UserDTO(
                    usuarioFinal.getIdUsuario(), // ✅ CRÍTICO: Enviar id_usuario
                    usuarioFinal.getNombres(),
                    usuarioFinal.getApellidos(),
                    usuarioFinal.getDni() + "@votosafe.pe", 
                    usuarioFinal.getTipoUsuario(),          
                    usuarioFinal.getDepartamento(),
                    java.time.LocalDate.now().toString()
            );

            String token = "token-" + UUID.randomUUID();
            System.out.println("✅ Login exitoso: " + usuarioFinal.getNombres());
            System.out.println("   Enviando id al frontend: " + usuarioFinal.getIdUsuario());
            
            return ResponseEntity.ok(
                    new AuthResponse(true, "Bienvenido " + usuarioFinal.getNombres(), token, userDto)
            );

        } catch (Exception e) {
            System.err.println("❌ Error en login: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(new AuthResponse(false, "Error interno: " + e.getMessage(), null, null));
        }
    }
}