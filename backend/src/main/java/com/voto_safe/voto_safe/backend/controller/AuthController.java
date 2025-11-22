// 1. EL PAQUETE CORRECTO (Según tu imagen)
package com.voto_safe.voto_safe.backend.controller;

// ✅ IMPORTS ACTUALIZADOS
// Fíjate que importamos AuthDtos.LoginRequest, etc.
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

// ... el resto del código del AuthController sigue igual ...
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
        String dniSolicitado = request.getId(); // El frontend manda 'id' (DNI)

        // --- PASO 1: BUSCAR EN BASE DE DATOS LOCAL ---
        Optional<Usuario> usuarioOpt = usuarioRepository.findByDni(dniSolicitado);
        Usuario usuarioFinal;

        if (usuarioOpt.isPresent()) {
            // A. El usuario YA EXISTE en tu PostgreSQL
            usuarioFinal = usuarioOpt.get();
        } else {
            // B. El usuario es NUEVO -> Consultamos a RENIEC
            System.out.println("Usuario no encontrado en BD. Consultando API Externa para DNI: " + dniSolicitado);
            Usuario usuarioReniec = reniecService.obtenerDatosReniec(dniSolicitado);

            if (usuarioReniec == null) {
                return ResponseEntity.status(404)
                        .body(new AuthResponse(false, "El DNI ingresado no es válido o no existe.", null, null));
            }

            // D. ÉXITO -> Guardamos al nuevo usuario en tu BD PostgreSQL
            usuarioFinal = usuarioRepository.save(usuarioReniec);
        }

        // --- PASO 2: RESPONDER AL FRONTEND ---
        // --- PASO 2: RESPONDER AL FRONTEND ---
        UserDTO userDto = new UserDTO(
                usuarioFinal.getDni(),
                usuarioFinal.getNombres(),   // Enviamos nombre limpio
                usuarioFinal.getApellidos(), // Enviamos apellido limpio
                usuarioFinal.getDni() + "@votosafe.pe", 
                usuarioFinal.getTipoUsuario(),          
                usuarioFinal.getDepartamento(),
                java.time.LocalDate.now().toString()
        );

        String fakeToken = "token-" + UUID.randomUUID();

        return ResponseEntity.ok(
                new AuthResponse(true, "Bienvenido " + usuarioFinal.getNombres(), fakeToken, userDto)
        );
    }
}