package com.voto_safe.voto_safe.backend.model.entity;

import jakarta.persistence.*;

/**
 * Entidad que representa un PARTIDO POLÍTICO
 * Mapea a la tabla 'partidos' en Supabase
 */
@Entity
@Table(name = "partidos")
public class Partido {

    @Id
    @Column(name = "id_partido", length = 50)
    private String idPartido;

    @Column(name = "id_categoria", length = 50)
    private String idCategoria;

    @Column(name = "id_eleccion", nullable = false, length = 50)
    private String idEleccion;

    @Column(name = "nombre", nullable = false, length = 255)
    private String nombre;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "url_logo", length = 255)
    private String urlLogo;

    // ============================================
    // CONSTRUCTORES
    // ============================================
    public Partido() {
    }

    public Partido(String idPartido, String idEleccion, String nombre) {
        this.idPartido = idPartido;
        this.idEleccion = idEleccion;
        this.nombre = nombre;
    }

    public Partido(String idPartido, String idCategoria, String idEleccion, 
                   String nombre, String descripcion, String urlLogo) {
        this.idPartido = idPartido;
        this.idCategoria = idCategoria;
        this.idEleccion = idEleccion;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.urlLogo = urlLogo;
    }

    // ============================================
    // GETTERS Y SETTERS
    // ============================================
    public String getIdPartido() {
        return idPartido;
    }

    public void setIdPartido(String idPartido) {
        this.idPartido = idPartido;
    }

    public String getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(String idCategoria) {
        this.idCategoria = idCategoria;
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

    public String getUrlLogo() {
        return urlLogo;
    }

    public void setUrlLogo(String urlLogo) {
        this.urlLogo = urlLogo;
    }

    // ============================================
    // MÉTODOS AUXILIARES
    // ============================================
    
    /**
     * Verificar si el partido tiene logo
     */
    public boolean hasLogo() {
        return urlLogo != null && !urlLogo.trim().isEmpty();
    }

    /**
     * Obtener iniciales del partido (para mostrar cuando no hay logo)
     */
    public String getIniciales() {
        if (nombre == null || nombre.isEmpty()) {
            return "??";
        }
        String[] palabras = nombre.split("\\s+");
        if (palabras.length == 1) {
            return nombre.substring(0, Math.min(2, nombre.length())).toUpperCase();
        }
        // Tomar primera letra de cada palabra
        StringBuilder iniciales = new StringBuilder();
        for (int i = 0; i < Math.min(3, palabras.length); i++) {
            if (!palabras[i].isEmpty()) {
                iniciales.append(palabras[i].charAt(0));
            }
        }
        return iniciales.toString().toUpperCase();
    }

    @Override
    public String toString() {
        return "Partido{" +
                "idPartido='" + idPartido + '\'' +
                ", nombre='" + nombre + '\'' +
                ", idEleccion='" + idEleccion + '\'' +
                ", idCategoria='" + idCategoria + '\'' +
                '}';
    }
}