package com.voto_safe.voto_safe.backend.repository;

import com.voto_safe.voto_safe.backend.model.entity.Voto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository para gestionar los Votos
 * Conecta con la tabla 'votos' en Supabase
 */
@Repository
public interface VotoRepository extends JpaRepository<Voto, String> {
    
    /**
     * CRÍTICO: Verificar si un usuario ya votó en una elección específica
     * @param idUsuario ID del usuario (DNI)
     * @param idEleccion ID de la elección
     * @return true si ya votó, false si no
     */
    boolean existsByIdUsuarioAndIdEleccion(String idUsuario, String idEleccion);
    
    /**
     * Buscar todos los votos de un usuario
     * @param idUsuario ID del usuario (DNI)
     * @return Lista de votos del usuario
     */
    List<Voto> findByIdUsuario(String idUsuario);
    
    /**
     * Buscar todos los votos de una elección
     * @param idEleccion ID de la elección
     * @return Lista de votos de esa elección
     */
    List<Voto> findByIdEleccion(String idEleccion);
    
    /**
     * Buscar el voto específico de un usuario en una elección
     * @param idUsuario ID del usuario
     * @param idEleccion ID de la elección
     * @return Optional con el voto si existe
     */
    Optional<Voto> findByIdUsuarioAndIdEleccion(String idUsuario, String idEleccion);
    
    /**
     * Contar cuántos votos tiene una elección
     * @param idEleccion ID de la elección
     * @return Número total de votos
     */
    long countByIdEleccion(String idEleccion);
    
    /**
     * Buscar votos realizados en un día específico
     * @param fecha Fecha del voto
     * @return Lista de votos de ese día
     */
    List<Voto> findByFechaVoto(LocalDate fecha);
    
    /**
     * Contar cuántos votos realizó un usuario (en todas las elecciones)
     * @param idUsuario ID del usuario
     * @return Número de votos del usuario
     */
    long countByIdUsuario(String idUsuario);
    
    /**
     * Buscar votos realizados en un rango de fechas
     * @param fechaInicio Fecha inicial
     * @param fechaFin Fecha final
     * @return Lista de votos en ese rango
     */
    @Query("SELECT v FROM Voto v WHERE v.fechaVoto BETWEEN :fechaInicio AND :fechaFin ORDER BY v.fechaVoto DESC")
    List<Voto> findVotosEnRango(LocalDate fechaInicio, LocalDate fechaFin);
    
    /**
     * Obtener estadísticas: Votos por elección (útil para el dashboard)
     * @return Lista con [idEleccion, nombreEleccion, totalVotos]
     */
    @Query("SELECT v.idEleccion, v.nombreEleccion, COUNT(v) FROM Voto v GROUP BY v.idEleccion, v.nombreEleccion")
    List<Object[]> getVotosPorEleccion();
}