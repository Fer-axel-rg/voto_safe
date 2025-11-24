package com.voto_safe.voto_safe.backend.model.entity;

import jakarta.persistence.*;

/**
 * Entidad que representa el DETALLE de cada VOTO
 * Guarda qué partido/candidato votó el usuario en cada categoría
 * Mapea a la tabla 'detalle_votos' en Supabase
 * 
 * ⚠️ CRÍTICA: Sin esta entidad NO se pueden guardar los votos específicos
 */
@Entity
@Table(name = "detalle_votos")
public class DetalleVoto {

    @Id
    @Column(name = "id_detalle_voto", length = 50)
    private String idDetalleVoto;

    @Column(name = "id_voto", nullable = false, length = 50)
    private String idVoto;

    // Datos desnormalizados (para reportes rápidos sin hacer JOINs)
    @Column(name = "id_usuario", length = 50)
    private String idUsuario;

    @Column(name = "id_eleccion", length = 50)
    private String idEleccion;

    @Column(name = "id_categoria", length = 50)
    private String idCategoria;

    @Column(name = "nombre_categoria", length = 100)
    private String nombreCategoria;

    @Column(name = "id_partido", length = 50)
    private String idPartido;

    @Column(name = "nombre_partido", length = 255)
    private String nombrePartido;

    @Column(name = "id_candidato", length = 50)
    private String idCandidato;

    @Column(name = "nombre_candidato", length = 255)
    private String nombreCandidato;

    // ============================================
    // CONSTRUCTORES
    // ============================================
    public DetalleVoto() {
    }

    public DetalleVoto(String idDetalleVoto, String idVoto, String idUsuario, String idEleccion,
                       String idCategoria, String nombreCategoria, String idPartido, String nombrePartido) {
        this.idDetalleVoto = idDetalleVoto;
        this.idVoto = idVoto;
        this.idUsuario = idUsuario;
        this.idEleccion = idEleccion;
        this.idCategoria = idCategoria;
        this.nombreCategoria = nombreCategoria;
        this.idPartido = idPartido;
        this.nombrePartido = nombrePartido;
    }

    // ============================================
    // GETTERS Y SETTERS
    // ============================================
    public String getIdDetalleVoto() {
        return idDetalleVoto;
    }

    public void setIdDetalleVoto(String idDetalleVoto) {
        this.idDetalleVoto = idDetalleVoto;
    }

    public String getIdVoto() {
        return idVoto;
    }

    public void setIdVoto(String idVoto) {
        this.idVoto = idVoto;
    }

    public String getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(String idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getIdEleccion() {
        return idEleccion;
    }

    public void setIdEleccion(String idEleccion) {
        this.idEleccion = idEleccion;
    }

    public String getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(String idCategoria) {
        this.idCategoria = idCategoria;
    }

    public String getNombreCategoria() {
        return nombreCategoria;
    }

    public void setNombreCategoria(String nombreCategoria) {
        this.nombreCategoria = nombreCategoria;
    }

    public String getIdPartido() {
        return idPartido;
    }

    public void setIdPartido(String idPartido) {
        this.idPartido = idPartido;
    }

    public String getNombrePartido() {
        return nombrePartido;
    }

    public void setNombrePartido(String nombrePartido) {
        this.nombrePartido = nombrePartido;
    }

    public String getIdCandidato() {
        return idCandidato;
    }

    public void setIdCandidato(String idCandidato) {
        this.idCandidato = idCandidato;
    }

    public String getNombreCandidato() {
        return nombreCandidato;
    }

    public void setNombreCandidato(String nombreCandidato) {
        this.nombreCandidato = nombreCandidato;
    }

    // ============================================
    // MÉTODOS AUXILIARES
    // ============================================
    
    /**
     * Verificar si es un voto en blanco
     */
    public boolean isVotoEnBlanco() {
        return "blanco".equalsIgnoreCase(idPartido) || "VOTO_BLANCO".equalsIgnoreCase(idPartido);
    }

    /**
     * Obtener descripción legible del voto
     */
    public String getDescripcion() {
        if (isVotoEnBlanco()) {
            return "Voto en blanco para " + nombreCategoria;
        }
        return nombrePartido + " en " + nombreCategoria;
    }

    @Override
    public String toString() {
        return "DetalleVoto{" +
                "idDetalleVoto='" + idDetalleVoto + '\'' +
                ", idVoto='" + idVoto + '\'' +
                ", idCategoria='" + idCategoria + '\'' +
                ", nombreCategoria='" + nombreCategoria + '\'' +
                ", idPartido='" + idPartido + '\'' +
                ", nombrePartido='" + nombrePartido + '\'' +
                '}';
    }
}