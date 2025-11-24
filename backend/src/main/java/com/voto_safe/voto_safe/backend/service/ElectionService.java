package com.voto_safe.voto_safe.backend.service;


import com.voto_safe.voto_safe.backend.model.entity.*;
import com.voto_safe.voto_safe.backend.repository.ElectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ElectionService {

    @Autowired
    private ElectionRepository electionRepository;

    public List<Election> findAll() {
        return electionRepository.findAll();
    }

    // CREAR
    public Election create(Election election) {
        if (election.getIdEleccion() == null || election.getIdEleccion().isEmpty()) {
            election.setIdEleccion(UUID.randomUUID().toString());
        }
        if (election.getEstado() == null) {
            election.setEstado("upcoming");
        }

        // Procesar Categorías (Hijos)
        if (election.getCategorias() != null) {
            for (Categoria cat : election.getCategorias()) {
                if (cat.getIdCategoria() == null || cat.getIdCategoria().isEmpty()) {
                    cat.setIdCategoria(UUID.randomUUID().toString());
                }
                cat.setEleccion(election); // Vinculación bidireccional
            }
        }

        return electionRepository.save(election);
    }

    public void delete(String id) {
        electionRepository.deleteById(id);
    }
    
    public Optional<Election> findById(String id) {
        return electionRepository.findById(id);
    }

    // ACTUALIZAR// 5. Actualizar (Blindado)
    public Election update(String id, Election datosNuevos) {
        return electionRepository.findById(id).map(e -> {
            // 1. Actualizar datos básicos
            e.setNombre(datosNuevos.getNombre());
            e.setDescripcion(datosNuevos.getDescripcion());
            e.setTipoEleccion(datosNuevos.getTipoEleccion());
            e.setFechaInicio(datosNuevos.getFechaInicio());
            e.setFechaFin(datosNuevos.getFechaFin());
            e.setEstado(datosNuevos.getEstado());

            // 2. Actualizar Categorías (LA CLAVE ESTÁ AQUÍ)
            // Limpiamos la lista existente
            e.getCategorias().clear();
            
            // Si vienen nuevas categorías, las agregamos y VINCULAMOS
            if (datosNuevos.getCategorias() != null) {
                for (Categoria cat : datosNuevos.getCategorias()) {
                    // Si es nueva, generamos ID
                    if (cat.getIdCategoria() == null || cat.getIdCategoria().length() < 10) {
                        cat.setIdCategoria(UUID.randomUUID().toString());
                    }
                    // ¡VINCULACIÓN OBLIGATORIA!
                    cat.setEleccion(e); 
                    
                    // Agregamos a la lista gestionada por Hibernate
                    e.getCategorias().add(cat);
                }
            }

            return electionRepository.save(e);
        }).orElseThrow(() -> new RuntimeException("Elección no encontrada"));
    }
}