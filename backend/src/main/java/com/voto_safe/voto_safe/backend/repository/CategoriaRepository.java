package com.voto_safe.voto_safe.backend.repository;

import com.voto_safe.voto_safe.backend.model.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository para gestionar las Categorías de las Elecciones
 * Conecta con la tabla 'categorias' en Supabase
 */
@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, String> {
    
    /**
     * Buscar todas las categorías de una elección específica
     * @param idEleccion ID de la elección
     * @return Lista de categorías
     */
    List<Categoria> findByIdEleccion(String idEleccion);
    
    /**
     * Verificar si existe alguna categoría para una elección
     * @param idEleccion ID de la elección
     * @return true si existe al menos una categoría
     */
    boolean existsByIdEleccion(String idEleccion);
    
    /**
     * Contar cuántas categorías tiene una elección
     * @param idEleccion ID de la elección
     * @return Número de categorías
     */
    long countByIdEleccion(String idEleccion);
}