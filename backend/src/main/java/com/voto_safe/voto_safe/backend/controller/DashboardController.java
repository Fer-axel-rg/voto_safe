package com.voto_safe.voto_safe.backend.controller;

import com.voto_safe.voto_safe.backend.dto.DashboardStatsDTO;
import com.voto_safe.voto_safe.backend.dto.ElectionSummaryDto;
import com.voto_safe.voto_safe.backend.model.entity.*;
import com.voto_safe.voto_safe.backend.repository.ElectionRepository;
import com.voto_safe.voto_safe.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    @Autowired
    private ElectionRepository electionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("/summary")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        
        // 1. Usamos los métodos nuevos (en español)
        long activeCount = electionRepository.countByEstado("active");
        long totalUsers = usuarioRepository.count();
        double voterPercentage = 0.0; 

        // 2. Obtener listas
        List<Election> upcomingRaw = electionRepository.findByEstado("upcoming");
        List<Election> activeRaw = electionRepository.findByEstado("active");

        // 3. Convertir
        List<ElectionSummaryDto> upcomingDTOs = upcomingRaw.stream()
            .map(this::mapToDTO)
            .limit(3)
            .collect(Collectors.toList());

        List<ElectionSummaryDto> activeDTOs = activeRaw.stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());

        DashboardStatsDTO stats = new DashboardStatsDTO(
            "Admin", 
            activeCount,
            totalUsers,
            voterPercentage,
            upcomingDTOs,
            activeDTOs
        );

        return ResponseEntity.ok(stats);
    }

    // TRADUCTOR: BD (Español) -> Frontend (Inglés)
    private ElectionSummaryDto mapToDTO(Election e) {
        return new ElectionSummaryDto(
            e.getIdEleccion(),      // id
            e.getNombre(),          // name
            e.getTipoEleccion(),    // type
            e.getEstado(),          // status
            e.getFechaInicio().toString(), // startDate
            e.getFechaFin().toString()     // endDate
        );
    }
}