package com.voto_safe.voto_safe.backend.repository;

import com.voto_safe.voto_safe.backend.model.entity.Partido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PartidoRepository extends JpaRepository<Partido, String> {
    // Buscar todos los partidos de una elección específica
    List<Partido> findByEleccionIdEleccion(String idEleccion);
}