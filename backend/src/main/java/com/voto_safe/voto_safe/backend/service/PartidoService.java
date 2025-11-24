package com.voto_safe.voto_safe.backend.service;

import com.voto_safe.voto_safe.backend.model.entity.Candidato;
import com.voto_safe.voto_safe.backend.model.entity.Election;
import com.voto_safe.voto_safe.backend.model.entity.Partido;
import com.voto_safe.voto_safe.backend.repository.ElectionRepository;
import com.voto_safe.voto_safe.backend.repository.PartidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PartidoService {

    @Autowired
    private PartidoRepository partidoRepository;

    @Autowired
    private ElectionRepository electionRepository;

    // Listar por Elección
    public List<Partido> getPartidosByEleccion(String idEleccion) {
        return partidoRepository.findByEleccionIdEleccion(idEleccion);
    }

    // Crear Partido y vincularlo a una Elección
    
    public Partido createPartido(String idEleccion, Partido partido) {
        Election election = electionRepository.findById(idEleccion)
                .orElseThrow(() -> new RuntimeException("Elección no encontrada"));

        if (partido.getIdPartido() == null) {
            partido.setIdPartido(UUID.randomUUID().toString());
        }
        partido.setEleccion(election);

        // Procesar Candidatos
        if (partido.getCandidatos() != null) {
            for (Candidato cand : partido.getCandidatos()) {
                if (cand.getIdCandidato() == null) {
                    cand.setIdCandidato(UUID.randomUUID().toString());
                }
                cand.setPartido(partido); // Vincular hijo con padre
            }
        }

        return partidoRepository.save(partido);
    }

    public void createPartiesBatch(String idEleccion, List<Partido> partidos) {
        Election election = electionRepository.findById(idEleccion)
                .orElseThrow(() -> new RuntimeException("Elección no encontrada"));

        for (Partido p : partidos) {
            if (p.getIdPartido() == null) {
                p.setIdPartido(UUID.randomUUID().toString());
            }
            p.setEleccion(election);

            // Procesar candidatos de cada partido
            if (p.getCandidatos() != null) {
                for (Candidato c : p.getCandidatos()) {
                    if (c.getIdCandidato() == null) {
                        c.setIdCandidato(UUID.randomUUID().toString());
                    }
                    c.setPartido(p);
                }
            }
        }
        
        // Guardar todos de una vez (más eficiente)
        partidoRepository.saveAll(partidos);
    }
    
    // Eliminar
    public void deletePartido(String id) {
        partidoRepository.deleteById(id);
    }
}