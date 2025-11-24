package com.voto_safe.voto_safe.backend.model.entity;

import jakarta.persistence.*;

/**
 * Entidad que representa una CATEGORÍA dentro de una ELECCIÓN
 * Ejemplo: "Presidente", "Vicepresidente", "Alcalde", etc.
 * Mapea a la tabla 'categorias' en Supabase
 */
@Entity
@Table(name = "categorias")
public class Categoria {

    @Id
    @Column(name = "id_categorias", length = 50)
    private String idCategorias;

    @Column(name = "id_eleccion", nullable = false, length = 50)
    private String idEleccion;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    // ============================================
    // CONSTRUCTORES
    // ============================================
    public Categoria() {
    }

    public Categoria(String idCategorias, String idEleccion, String nombre, String descripcion) {
        this.idCategorias = idCategorias;
        this.idEleccion = idEleccion;
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    // ============================================
    // GETTERS Y SETTERS
    // ============================================
    public String getIdCategorias() {
        return idCategorias;
    }

    public void setIdCategorias(String idCategorias) {
        this.idCategorias = idCategorias;
    }

    public String getIdEleccion() {
        return idEleccion;
    }

    public void setIdEleccion(String idEleccion) {
        this.idEleccion = idEleccion;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    // ============================================
    // MÉTODOS AUXILIARES
    // ============================================
    @Override
    public String toString() {
        return "Categoria{" +
                "idCategorias='" + idCategorias + '\'' +
                ", idEleccion='" + idEleccion + '\'' +
                ", nombre='" + nombre + '\'' +
                ", descripcion='" + descripcion + '\'' +
                '}';
    }
}