package com.voto_safe.voto_safe.backend.controller;

import com.voto_safe.voto_safe.backend.model.entity.Partido;
import com.voto_safe.voto_safe.backend.repository.PartidoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/parties")
@CrossOrigin(origins = "http://localhost:5173")
public class PartyController {

    @Autowired
    private PartidoRepository partidoRepository;

    /**
     * Obtener todos los partidos
     * GET /api/v1/parties
     */
    @GetMapping
    public ResponseEntity<List<PartidoDTO>> getAllParties() {
        try {
            List<Partido> partidos = partidoRepository.findAll();
            
            List<PartidoDTO> dtos = partidos.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

            return ResponseEntity.ok(dtos);

        } catch (Exception e) {
            System.err.println("Error en getAllParties: " + e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    /**
     * Obtener partidos de una elección específica
     * GET /api/v1/parties/election/{electionId}
     */
    @GetMapping("/election/{electionId}")
    public ResponseEntity<List<PartidoDTO>> getPartiesByElection(@PathVariable String electionId) {
        try {
            List<Partido> partidos = partidoRepository.findByIdEleccion(electionId);
            
            List<PartidoDTO> dtos = partidos.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

            return ResponseEntity.ok(dtos);

        } catch (Exception e) {
            System.err.println("Error en getPartiesByElection: " + e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    /**
     * Obtener un partido específico
     * GET /api/v1/parties/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<PartidoDTO> getPartyById(@PathVariable String id) {
        try {
            Optional<Partido> partidoOpt = partidoRepository.findById(id);

            if (!partidoOpt.isPresent()) {
                return ResponseEntity.status(404).body(null);
            }

            Partido partido = partidoOpt.get();
            PartidoDTO dto = mapToDTO(partido);

            return ResponseEntity.ok(dto);

        } catch (Exception e) {
            System.err.println("Error en getPartyById: " + e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    /**
     * Crear un nuevo partido
     * POST /api/v1/parties
     */
    @PostMapping
    public ResponseEntity<PartidoDTO> createParty(@RequestBody CreatePartyRequest request) {
        try {
            Partido partido = new Partido();
            partido.setIdPartido(UUID.randomUUID().toString());
            partido.setIdEleccion(request.id_eleccion);
            partido.setIdCategoria(request.id_categoria);
            partido.setNombre(request.nombre);
            partido.setDescripcion(request.descripcion);
            partido.setUrlLogo(request.url_logo);

            Partido savedPartido = partidoRepository.save(partido);
            PartidoDTO dto = mapToDTO(savedPartido);

            return ResponseEntity.status(201).body(dto);

        } catch (Exception e) {
            System.err.println("Error en createParty: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    /**
     * Actualizar un partido
     * PUT /api/v1/parties/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<PartidoDTO> updateParty(
            @PathVariable String id,
            @RequestBody UpdatePartyRequest request
    ) {
        try {
            Optional<Partido> partidoOpt = partidoRepository.findById(id);

            if (!partidoOpt.isPresent()) {
                return ResponseEntity.status(404).body(null);
            }

            Partido partido = partidoOpt.get();

            if (request.nombre != null) partido.setNombre(request.nombre);
            if (request.descripcion != null) partido.setDescripcion(request.descripcion);
            if (request.url_logo != null) partido.setUrlLogo(request.url_logo);
            if (request.id_categoria != null) partido.setIdCategoria(request.id_categoria);

            Partido updatedPartido = partidoRepository.save(partido);
            PartidoDTO dto = mapToDTO(updatedPartido);

            return ResponseEntity.ok(dto);

        } catch (Exception e) {
            System.err.println("Error en updateParty: " + e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    /**
     * Eliminar un partido
     * DELETE /api/v1/parties/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<DeleteResponse> deleteParty(@PathVariable String id) {
        try {
            Optional<Partido> partidoOpt = partidoRepository.findById(id);

            if (!partidoOpt.isPresent()) {
                return ResponseEntity.status(404)
                    .body(new DeleteResponse(false, "Partido no encontrado"));
            }

            partidoRepository.deleteById(id);

            return ResponseEntity.ok(
                new DeleteResponse(true, "Partido eliminado exitosamente")
            );

        } catch (Exception e) {
            System.err.println("Error en deleteParty: " + e.getMessage());
            return ResponseEntity.status(500)
                .body(new DeleteResponse(false, "Error al eliminar partido"));
        }
    }

    // ============================================
    // MÉTODO AUXILIAR: Mapear Partido → DTO
    // ============================================
    private PartidoDTO mapToDTO(Partido partido) {
        PartidoDTO dto = new PartidoDTO();
        dto.id_partido = partido.getIdPartido();
        dto.id_eleccion = partido.getIdEleccion();
        dto.id_categoria = partido.getIdCategoria();
        dto.nombre = partido.getNombre();
        dto.descripcion = partido.getDescripcion();
        dto.url_logo = partido.getUrlLogo();
        return dto;
    }

    // ============================================
    // CLASES DTO INTERNAS
    // ============================================
    
    public static class PartidoDTO {
        public String id_partido;
        public String id_eleccion;
        public String id_categoria;
        public String nombre;
        public String descripcion;
        public String url_logo;
    }

    public static class CreatePartyRequest {
        public String id_eleccion;
        public String id_categoria;
        public String nombre;
        public String descripcion;
        public String url_logo;
    }

    public static class UpdatePartyRequest {
        public String nombre;
        public String descripcion;
        public String url_logo;
        public String id_categoria;
    }

    public static class DeleteResponse {
        public boolean success;
        public String message;

        public DeleteResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }
    }
}