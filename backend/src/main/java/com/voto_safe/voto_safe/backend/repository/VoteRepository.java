package com.voto_safe.voto_safe.backend.repository;

import com.voto_safe.voto_safe.backend.model.entity.Voto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional; // <--- No olvides importar esto

@Repository
public interface VoteRepository extends JpaRepository<Voto, String> {

    boolean existsByIdUsuario(String idUsuario);
    
    long countByIdEleccion(String idEleccion);

    // --- CONSULTA MAESTRA CORREGIDA ---
    @Query(value = "SELECT p.nombre, p.url_logo, COUNT(d.id_detalle_voto) " + 
                   "FROM partidos p " +
                   "LEFT JOIN detalle_votos d ON p.id_partido = d.id_partido AND d.id_eleccion = :eleccionId " +
                   "WHERE p.id_eleccion = :eleccionId " +
                   "GROUP BY p.id_partido, p.nombre, p.url_logo " +
                   "ORDER BY COUNT(d.id_detalle_voto) DESC", nativeQuery = true)
    List<Object[]> countVotesByParty(@Param("eleccionId") String eleccionId);
    // --- NUEVO MÉTODO ---
    // Busca el primer voto que encuentre de este usuario
    Optional<Voto> findFirstByIdUsuario(String idUsuario);
    
}