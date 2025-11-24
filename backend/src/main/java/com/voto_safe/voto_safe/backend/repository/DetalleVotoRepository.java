package com.voto_safe.voto_safe.backend.repository;

import com.voto_safe.voto_safe.backend.model.entity.DetalleVoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository para gestionar los Detalles de Votos
 * Conecta con la tabla 'detalle_votos' en Supabase
 * Aquí se guardan los votos específicos por categoría y partido
 */
@Repository
public interface DetalleVotoRepository extends JpaRepository<DetalleVoto, String> {
    
    /**
     * Buscar todos los detalles de un voto específico
     * @param idVoto ID del voto principal
     * @return Lista de detalles (uno por cada categoría votada)
     */
    List<DetalleVoto> findByIdVoto(String idVoto);
    
    /**
     * Buscar detalles de votos de una elección específica
     * @param idEleccion ID de la elección
     * @return Lista de detalles de votos
     */
    List<DetalleVoto> findByIdEleccion(String idEleccion);
    
    /**
     * Buscar detalles de votos de un usuario
     * @param idUsuario ID del usuario
     * @return Lista de detalles de votos del usuario
     */
    List<DetalleVoto> findByIdUsuario(String idUsuario);
    
    /**
     * Buscar votos de una categoría específica
     * @param idCategoria ID de la categoría
     * @return Lista de detalles de votos de esa categoría
     */
    List<DetalleVoto> findByIdCategoria(String idCategoria);
    
    /**
     * IMPORTANTE: Contar votos por partido en una elección
     * Útil para generar resultados
     * @param idEleccion ID de la elección
     * @param idPartido ID del partido
     * @return Número de votos que recibió el partido
     */
    long countByIdEleccionAndIdPartido(String idEleccion, String idPartido);
    
    /**
     * IMPORTANTE: Contar votos por partido en una categoría específica
     * @param idEleccion ID de la elección
     * @param idCategoria ID de la categoría
     * @param idPartido ID del partido
     * @return Número de votos
     */
    long countByIdEleccionAndIdCategoriaAndIdPartido(String idEleccion, String idCategoria, String idPartido);
    
    /**
     * Obtener resultados agrupados por partido (para estadísticas)
     * @param idEleccion ID de la elección
     * @return Lista con [idPartido, nombrePartido, totalVotos]
     */
    @Query("SELECT d.idPartido, d.nombrePartido, COUNT(d) FROM DetalleVoto d WHERE d.idEleccion = :idEleccion GROUP BY d.idPartido, d.nombrePartido ORDER BY COUNT(d) DESC")
    List<Object[]> getResultadosPorPartido(String idEleccion);
    
    /**
     * Obtener resultados por categoría en una elección
     * @param idEleccion ID de la elección
     * @param idCategoria ID de la categoría
     * @return Lista con [idPartido, nombrePartido, totalVotos]
     */
    @Query("SELECT d.idPartido, d.nombrePartido, COUNT(d) FROM DetalleVoto d WHERE d.idEleccion = :idEleccion AND d.idCategoria = :idCategoria GROUP BY d.idPartido, d.nombrePartido ORDER BY COUNT(d) DESC")
    List<Object[]> getResultadosPorCategoria(String idEleccion, String idCategoria);
    
    /**
     * Contar votos en blanco de una elección
     * @param idEleccion ID de la elección
     * @return Número de votos en blanco
     */
    @Query("SELECT COUNT(d) FROM DetalleVoto d WHERE d.idEleccion = :idEleccion AND d.idPartido = 'blanco'")
    long countVotosEnBlanco(String idEleccion);
    
    /**
     * Buscar detalles de votos de un candidato específico (si se usa)
     * @param idCandidato ID del candidato
     * @return Lista de detalles de votos
     */
    List<DetalleVoto> findByIdCandidato(String idCandidato);
    
    /**
     * Verificar si existe algún voto para un partido en una elección
     * @param idPartido ID del partido
     * @param idEleccion ID de la elección
     * @return true si hay al menos un voto
     */
    boolean existsByIdPartidoAndIdEleccion(String idPartido, String idEleccion);
}