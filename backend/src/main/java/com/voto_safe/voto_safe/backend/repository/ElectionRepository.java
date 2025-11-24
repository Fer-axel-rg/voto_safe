package com.voto_safe.voto_safe.backend.repository;

import com.voto_safe.voto_safe.backend.model.entity.Election;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ElectionRepository extends JpaRepository<Election, String> {
    
    // JPA crea el SQL basado en el nombre de la variable en 'Election.java'
    // SELECT * FROM elecciones WHERE estado = ?
    List<Election> findByEstado(String estado);
    
    long countByEstado(String estado);
}