package com.voto_safe.voto_safe.backend.controller;

import com.voto_safe.voto_safe.backend.model.entity.Voto;
import com.voto_safe.voto_safe.backend.model.entity.DetalleVoto;
import com.voto_safe.voto_safe.backend.model.entity.Usuario;
import com.voto_safe.voto_safe.backend.repository.VotoRepository;
import com.voto_safe.voto_safe.backend.repository.DetalleVotoRepository;
import com.voto_safe.voto_safe.backend.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/votes")
@CrossOrigin(origins = "http://localhost:5173")
public class VoteController {

    @Autowired
    private VotoRepository votoRepository;

    @Autowired
    private DetalleVotoRepository detalleVotoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("/check/{userId}/{electionId}")
    public ResponseEntity<Map<String, Boolean>> checkIfUserVoted(
        @PathVariable String userId,
        @PathVariable String electionId
    ) {
        try {
            System.out.println("🔍 Verificando voto: Usuario=" + userId + ", Elección=" + electionId);
            
            boolean hasVoted = votoRepository.existsByIdUsuarioAndIdEleccion(userId, electionId);
            
            System.out.println(hasVoted ? "⚠️ Usuario YA votó" : "✅ Usuario AÚN NO vota");
            
            Map<String, Boolean> response = new HashMap<>();
            response.put("hasVoted", hasVoted);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error en checkIfUserVoted: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("hasVoted", false));
        }
    }

    @PostMapping("/submit")
    public ResponseEntity<VoteResponse> submitVote(@RequestBody VoteSubmissionDTO request) {
        try {
            System.out.println("📥 Recibiendo voto:");
            System.out.println("   Usuario: " + request.id_usuario);
            System.out.println("   Elección: " + request.id_eleccion);
            System.out.println("   Categorías votadas: " + request.votos.size());

            // 🔒 VALIDACIÓN 1: Verificar que el usuario existe
            boolean usuarioExiste = usuarioRepository.existsById(request.id_usuario);
            
            if (!usuarioExiste) {
                // Fallback: buscar por DNI
                Optional<Usuario> usuarioOpt = usuarioRepository.findByDni(request.id_usuario);
                
                if (usuarioOpt.isPresent()) {
                    request.id_usuario = usuarioOpt.get().getIdUsuario();
                    System.out.println("⚠️ Corrigiendo id_usuario: " + request.id_usuario);
                } else {
                    System.err.println("❌ Usuario no encontrado: " + request.id_usuario);
                    return ResponseEntity.status(400)
                        .body(new VoteResponse(false, "Usuario no encontrado. Por favor, inicia sesión nuevamente.", null));
                }
            }

            // 🔒 VALIDACIÓN 2: Verificar que NO haya votado antes
            boolean yaVoto = votoRepository.existsByIdUsuarioAndIdEleccion(
                request.id_usuario, 
                request.id_eleccion
            );

            if (yaVoto) {
                System.err.println("❌ Usuario YA votó en esta elección");
                return ResponseEntity.status(400)
                    .body(new VoteResponse(false, "Ya has emitido tu voto en esta elección. No puedes votar nuevamente.", null));
            }

            // ✅ GUARDAR VOTO
            String votoId = UUID.randomUUID().toString();
            
            Voto voto = new Voto();
            voto.setIdVoto(votoId);
            voto.setIdUsuario(request.id_usuario);
            voto.setIdEleccion(request.id_eleccion);
            voto.setNombreEleccion(request.nombre_eleccion);
            voto.setFechaVoto(LocalDate.now());
            voto.setInformacionDispositivo("Web Browser");

            votoRepository.save(voto);
            System.out.println("✅ Voto principal guardado: " + votoId);

            for (VoteDetailDTO detalle : request.votos) {
                DetalleVoto detalleVoto = new DetalleVoto();
                detalleVoto.setIdDetalleVoto(UUID.randomUUID().toString());
                detalleVoto.setIdVoto(votoId);
                detalleVoto.setIdUsuario(request.id_usuario);
                detalleVoto.setIdEleccion(request.id_eleccion);
                detalleVoto.setIdCategoria(detalle.id_categoria);
                detalleVoto.setNombreCategoria(detalle.nombre_categoria);
                detalleVoto.setIdPartido(detalle.id_partido);
                detalleVoto.setNombrePartido(detalle.nombre_partido);

                detalleVotoRepository.save(detalleVoto);
                System.out.println("   ✅ Detalle: " + detalle.nombre_categoria + " → " + detalle.nombre_partido);
            }
            
            System.out.println("🎉 VOTO REGISTRADO EXITOSAMENTE");

            return ResponseEntity.ok(
                new VoteResponse(true, "¡Tu voto ha sido registrado exitosamente! Gracias por participar.", votoId)
            );

        } catch (Exception e) {
            System.err.println("❌ Error en submitVote: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body(new VoteResponse(false, "Error al procesar el voto: " + e.getMessage(), null));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Voto>> getUserVotes(@PathVariable String userId) {
        try {
            System.out.println("📋 Obteniendo votos del usuario: " + userId);
            List<Voto> votos = votoRepository.findByIdUsuario(userId);
            System.out.println("✅ Votos encontrados: " + votos.size());
            return ResponseEntity.ok(votos);
        } catch (Exception e) {
            System.err.println("❌ Error en getUserVotes: " + e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    // DTOs
    public static class VoteSubmissionDTO {
        public String id_usuario;
        public String dni_usuario;
        public String id_eleccion;
        public String nombre_eleccion;
        public List<VoteDetailDTO> votos;
    }

    public static class VoteDetailDTO {
        public String id_categoria;
        public String nombre_categoria;
        public String id_partido;
        public String nombre_partido;
    }

    public static class VoteResponse {
        public boolean success;
        public String message;
        public String id_voto;

        public VoteResponse(boolean success, String message, String id_voto) {
            this.success = success;
            this.message = message;
            this.id_voto = id_voto;
        }
    }
}