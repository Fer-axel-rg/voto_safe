package com.voto_safe.voto_safe.backend.controller;

import com.voto_safe.voto_safe.backend.model.entity.Eleccion;
import com.voto_safe.voto_safe.backend.model.entity.Categoria;
import com.voto_safe.voto_safe.backend.repository.EleccionRepository;
import com.voto_safe.voto_safe.backend.repository.CategoriaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/elections")
@CrossOrigin(origins = "http://localhost:5173")
public class ElectionController {

    @Autowired
    private EleccionRepository eleccionRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    /**
     * Obtener todas las elecciones
     * GET /api/v1/elections
     */
    @GetMapping
    public ResponseEntity<List<EleccionDTO>> getAllElections() {
        try {
            System.out.println("📋 GET /api/v1/elections - Obteniendo todas las elecciones");
            
            List<Eleccion> elecciones = eleccionRepository.findAll();
            
            List<EleccionDTO> dtos = elecciones.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

            System.out.println("✅ Enviando " + dtos.size() + " elecciones");
            return ResponseEntity.ok(dtos);

        } catch (Exception e) {
            System.err.println("❌ Error en getAllElections: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    /**
     * Obtener todas las elecciones activas
     * GET /api/v1/elections/active
     * 
     * ✅ CORREGIDO: Ahora filtra correctamente por estado y fechas
     */
    @GetMapping("/active")
    public ResponseEntity<List<EleccionDTO>> getActiveElections() {
        try {
            System.out.println("📋 GET /api/v1/elections/active - Obteniendo elecciones activas");
            LocalDate today = LocalDate.now();
            
            List<Eleccion> elecciones = eleccionRepository.findAll().stream()
                .filter(e -> {
                    // Acepta tanto "active" como "ACTIVO" (compatibilidad con Supabase)
                    String estado = e.getEstado() != null ? e.getEstado().toLowerCase() : "";
                    boolean estadoValido = estado.equals("active") || estado.equals("activo") || estado.equals("upcoming");
                    
                    // Verifica que las fechas sean válidas
                    boolean fechasValidas = e.getFechaInicio() != null && e.getFechaFin() != null;
                    
                    // Verifica que esté dentro del rango de fechas
                    boolean dentroRango = fechasValidas && 
                        (today.isEqual(e.getFechaInicio()) || today.isAfter(e.getFechaInicio())) &&
                        (today.isEqual(e.getFechaFin()) || today.isBefore(e.getFechaFin()));
                    
                    System.out.println("  📊 Elección: " + e.getNombre() + 
                                     " | Estado: " + estado + 
                                     " | En rango: " + dentroRango);
                    
                    return estadoValido && fechasValidas && dentroRango;
                })
                .collect(Collectors.toList());

            List<EleccionDTO> dtos = elecciones.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

            System.out.println("✅ Enviando " + dtos.size() + " elecciones activas");
            return ResponseEntity.ok(dtos);

        } catch (Exception e) {
            System.err.println("❌ Error en getActiveElections: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    /**
     * Obtener una elección específica con sus categorías
     * GET /api/v1/elections/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<EleccionDTO> getElectionById(@PathVariable String id) {
        try {
            System.out.println("🔍 GET /api/v1/elections/" + id + " - Buscando elección");
            
            Optional<Eleccion> eleccionOpt = eleccionRepository.findById(id);

            if (!eleccionOpt.isPresent()) {
                System.err.println("❌ Elección no encontrada: " + id);
                return ResponseEntity.status(404).body(null);
            }

            Eleccion eleccion = eleccionOpt.get();
            EleccionDTO dto = mapToDTO(eleccion);

            System.out.println("✅ Elección encontrada: " + dto.nombre);
            System.out.println("  📁 Categorías: " + dto.categorias.size());
            
            return ResponseEntity.ok(dto);

        } catch (Exception e) {
            System.err.println("❌ Error en getElectionById: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    /**
     * Crear una nueva elección
     * POST /api/v1/elections
     */
    @PostMapping
    public ResponseEntity<EleccionDTO> createElection(@RequestBody CreateElectionRequest request) {
        try {
            System.out.println("📥 POST /api/v1/elections - Creando elección");
            System.out.println("📝 nombre: " + request.nombre);
            System.out.println("📝 tipo_eleccion: " + request.tipo_eleccion);
            System.out.println("📝 estado: " + request.estado);

            // Crear la elección
            Eleccion eleccion = new Eleccion();
            
            String eleccionId = (request.id_eleccion != null && !request.id_eleccion.isEmpty()) 
                ? request.id_eleccion 
                : UUID.randomUUID().toString();
            
            eleccion.setIdEleccion(eleccionId);
            eleccion.setNombre(request.nombre);
            eleccion.setDescripcion(request.descripcion);
            eleccion.setTipoEleccion(request.tipo_eleccion);
            eleccion.setFechaInicio(LocalDate.parse(request.fecha_inicio));
            eleccion.setFechaFin(LocalDate.parse(request.fecha_fin));
            eleccion.setEstado(request.estado);

            Eleccion savedEleccion = eleccionRepository.save(eleccion);
            System.out.println("✅ Elección guardada con ID: " + savedEleccion.getIdEleccion());

            // Crear las categorías si vienen en el request
            if (request.categorias != null && !request.categorias.isEmpty()) {
                System.out.println("📁 Guardando " + request.categorias.size() + " categorías...");
                
                for (CategoriaRequest catReq : request.categorias) {
                    Categoria categoria = new Categoria();
                    
                    String categoriaId = (catReq.id != null && !catReq.id.isEmpty())
                        ? catReq.id
                        : UUID.randomUUID().toString();
                    
                    categoria.setIdCategorias(categoriaId);
                    categoria.setIdEleccion(savedEleccion.getIdEleccion());
                    categoria.setNombre(catReq.name);
                    categoria.setDescripcion(catReq.description);
                    
                    categoriaRepository.save(categoria);
                    System.out.println("  ✅ Categoría guardada: " + catReq.name);
                }
            }

            EleccionDTO dto = mapToDTO(savedEleccion);
            return ResponseEntity.status(201).body(dto);

        } catch (Exception e) {
            System.err.println("❌ Error en createElection: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    /**
     * Actualizar una elección
     * PUT /api/v1/elections/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<EleccionDTO> updateElection(
            @PathVariable String id,
            @RequestBody UpdateElectionRequest request
    ) {
        try {
            System.out.println("🔄 PUT /api/v1/elections/" + id);
            
            Optional<Eleccion> eleccionOpt = eleccionRepository.findById(id);

            if (!eleccionOpt.isPresent()) {
                return ResponseEntity.status(404).body(null);
            }

            Eleccion eleccion = eleccionOpt.get();

            if (request.nombre != null) eleccion.setNombre(request.nombre);
            if (request.descripcion != null) eleccion.setDescripcion(request.descripcion);
            if (request.tipo_eleccion != null) eleccion.setTipoEleccion(request.tipo_eleccion);
            if (request.fecha_inicio != null) eleccion.setFechaInicio(LocalDate.parse(request.fecha_inicio));
            if (request.fecha_fin != null) eleccion.setFechaFin(LocalDate.parse(request.fecha_fin));
            if (request.estado != null) eleccion.setEstado(request.estado);

            Eleccion updatedEleccion = eleccionRepository.save(eleccion);
            EleccionDTO dto = mapToDTO(updatedEleccion);

            System.out.println("✅ Elección actualizada");
            return ResponseEntity.ok(dto);

        } catch (Exception e) {
            System.err.println("❌ Error en updateElection: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    /**
     * Eliminar una elección
     * DELETE /api/v1/elections/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<DeleteResponse> deleteElection(@PathVariable String id) {
        try {
            System.out.println("🗑️ DELETE /api/v1/elections/" + id);
            
            Optional<Eleccion> eleccionOpt = eleccionRepository.findById(id);

            if (!eleccionOpt.isPresent()) {
                return ResponseEntity.status(404)
                    .body(new DeleteResponse(false, "Elección no encontrada"));
            }

            List<Categoria> categorias = categoriaRepository.findByIdEleccion(id);
            categoriaRepository.deleteAll(categorias);
            
            eleccionRepository.deleteById(id);
            System.out.println("✅ Elección eliminada");

            return ResponseEntity.ok(
                new DeleteResponse(true, "Elección eliminada exitosamente")
            );

        } catch (Exception e) {
            System.err.println("❌ Error en deleteElection: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body(new DeleteResponse(false, "Error al eliminar elección"));
        }
    }

    // ============================================
    // MAPEO: Eleccion → DTO
    // ✅ MEJORADO: Normaliza el estado y mapea correctamente
    // ============================================
    private EleccionDTO mapToDTO(Eleccion eleccion) {
        EleccionDTO dto = new EleccionDTO();
        
        dto.id_eleccion = eleccion.getIdEleccion();
        dto.nombre = eleccion.getNombre();
        dto.descripcion = eleccion.getDescripcion();
        dto.tipo_eleccion = eleccion.getTipoEleccion();
        dto.fecha_inicio = eleccion.getFechaInicio().toString();
        dto.fecha_fin = eleccion.getFechaFin().toString();
        
        // ✅ NORMALIZAR ESTADO: "ACTIVO" → "active"
        String estadoOriginal = eleccion.getEstado();
        dto.estado = estadoOriginal != null ? estadoOriginal.toLowerCase() : "active";
        
        dto.allow_null_vote = true;
        dto.require_minimum_category = false;
        dto.allow_multiple_votes = false;
        dto.auto_send_vote = false;

        // ✅ Cargar categorías
        List<Categoria> categorias = categoriaRepository.findByIdEleccion(eleccion.getIdEleccion());
        dto.categorias = categorias.stream()
            .map(this::mapCategoriaToDTO)
            .collect(Collectors.toList());

        return dto;
    }

    // ✅ MEJORADO: Mapea con ambos formatos (id/id_categorias, name/nombre)
    private CategoriaDTO mapCategoriaToDTO(Categoria cat) {
        CategoriaDTO dto = new CategoriaDTO();
        dto.id = cat.getIdCategorias();
        dto.id_categorias = cat.getIdCategorias(); // ✅ AGREGADO
        dto.name = cat.getNombre();
        dto.nombre = cat.getNombre(); // ✅ AGREGADO
        dto.description = cat.getDescripcion();
        dto.descripcion = cat.getDescripcion(); // ✅ AGREGADO
        return dto;
    }

    // ============================================
    // CLASES DTO
    // ============================================
    
    public static class EleccionDTO {
        public String id_eleccion;
        public String nombre;
        public String descripcion;
        public String tipo_eleccion;
        public String fecha_inicio;
        public String fecha_fin;
        public String estado;
        public Boolean allow_null_vote;
        public Boolean require_minimum_category;
        public Boolean allow_multiple_votes;
        public Boolean auto_send_vote;
        public List<CategoriaDTO> categorias;
        public String created_at;
    }

    // ✅ MEJORADO: Ahora tiene AMBOS formatos para compatibilidad
    public static class CategoriaDTO {
        public String id;
        public String id_categorias; // ✅ AGREGADO
        public String name;
        public String nombre; // ✅ AGREGADO
        public String description;
        public String descripcion; // ✅ AGREGADO
    }

    public static class CreateElectionRequest {
        public String id_eleccion;
        public String nombre;
        public String descripcion;
        public String tipo_eleccion;
        public String fecha_inicio;
        public String fecha_fin;
        public String estado;
        public Boolean allow_null_vote;
        public Boolean require_minimum_category;
        public Boolean allow_multiple_votes;
        public Boolean auto_send_vote;
        public List<CategoriaRequest> categorias;
    }

    public static class CategoriaRequest {
        public String id;
        public String name;
        public String description;
    }

    public static class UpdateElectionRequest {
        public String nombre;
        public String descripcion;
        public String tipo_eleccion;
        public String fecha_inicio;
        public String fecha_fin;
        public String estado;
        public Boolean allow_null_vote;
        public Boolean require_minimum_category;
        public Boolean allow_multiple_votes;
        public Boolean auto_send_vote;
        public List<CategoriaRequest> categorias;
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