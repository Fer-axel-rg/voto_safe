package com.voto_safe.voto_safe.backend.repository;

import com.voto_safe.voto_safe.backend.model.entity.Partido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository para gestionar los Partidos Políticos.
 * Conecta con la tabla 'partidos' en Supabase.
 */
@Repository
public interface PartidoRepository extends JpaRepository<Partido, String> {

    /**
     * Buscar partidos de una elección específica.
     * @param idEleccion ID de la elección.
     * @return Lista de partidos.
     */
    List<Partido> findByIdEleccion(String idEleccion);

    /**
     * Buscar partidos de una categoría específica.
     * @param idCategoria ID de la categoría.
     * @return Lista de partidos.
     */
    List<Partido> findByIdCategoria(String idCategoria);

    /**
     * Buscar partidos por elección y categoría.
     * @param idEleccion ID de la elección.
     * @param idCategoria ID de la categoría.
     * @return Lista de partidos.
     */
    List<Partido> findByIdEleccionAndIdCategoria(String idEleccion, String idCategoria);

    /**
     * Verificar si existe un partido con ese nombre en una elección.
     * @param nombre Nombre del partido.
     * @param idEleccion ID de la elección.
     * @return true si existe.
     */
    boolean existsByNombreAndIdEleccion(String nombre, String idEleccion);

    /**
     * Contar partidos de una elección.
     * @param idEleccion ID de la elección.
     * @return Número de partidos.
     */
    long countByIdEleccion(String idEleccion);
}
