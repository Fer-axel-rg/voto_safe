package com.voto_safe.voto_safe.backend.repository;

import com.voto_safe.voto_safe.backend.model.entity.Eleccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository para gestionar las Elecciones
 * Conecta con la tabla 'elecciones' en Supabase
 */
@Repository
public interface EleccionRepository extends JpaRepository<Eleccion, String> {
    
    /**
     * Buscar elecciones por estado
     * @param estado Estado de la elección (active, upcoming, finished)
     * @return Lista de elecciones con ese estado
     */
    List<Eleccion> findByEstado(String estado);
    
    /**
     * Buscar elecciones por tipo
     * @param tipoEleccion Tipo de elección (Presidencial, Municipal, Otros)
     * @return Lista de elecciones de ese tipo
     */
    List<Eleccion> findByTipoEleccion(String tipoEleccion);
    
    /**
     * Buscar elecciones activas (estado = 'active' y dentro del rango de fechas)
     * @param hoy Fecha actual
     * @return Lista de elecciones activas
     */
    @Query("SELECT e FROM Eleccion e WHERE e.estado = 'active' AND e.fechaInicio <= :hoy AND e.fechaFin >= :hoy")
    List<Eleccion> findActiveElections(LocalDate hoy);
    
    /**
     * Buscar elecciones próximas (estado = 'upcoming' y fecha de inicio futura)
     * @param hoy Fecha actual
     * @return Lista de elecciones próximas
     */
    @Query("SELECT e FROM Eleccion e WHERE e.estado = 'upcoming' AND e.fechaInicio > :hoy ORDER BY e.fechaInicio ASC")
    List<Eleccion> findUpcomingElections(LocalDate hoy);
    
    /**
     * Buscar elecciones finalizadas (estado = 'finished' o fecha de fin pasada)
     * @param hoy Fecha actual
     * @return Lista de elecciones finalizadas
     */
    @Query("SELECT e FROM Eleccion e WHERE e.estado = 'finished' OR e.fechaFin < :hoy ORDER BY e.fechaFin DESC")
    List<Eleccion> findFinishedElections(LocalDate hoy);
    
    /**
     * Buscar elección por nombre (case insensitive)
     * @param nombre Nombre de la elección
     * @return Optional con la elección si existe
     */
    Optional<Eleccion> findByNombreIgnoreCase(String nombre);
    
    /**
     * Verificar si existe una elección con un nombre específico
     * @param nombre Nombre de la elección
     * @return true si existe
     */
    boolean existsByNombre(String nombre);
    
    /**
     * Contar elecciones activas
     * @return Número de elecciones activas
     */
    long countByEstado(String estado);
}