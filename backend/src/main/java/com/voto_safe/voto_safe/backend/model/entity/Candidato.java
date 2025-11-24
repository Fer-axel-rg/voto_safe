package com.voto_safe.voto_safe.backend.model.entity;

import jakarta.persistence.*;

/**
 * Entidad que representa un CANDIDATO de un PARTIDO
 * Mapea a la tabla 'candidatos' en Supabase
 * 
 * NOTA: Es opcional si solo votan por partidos, pero útil si votan por candidatos específicos
 */
@Entity
@Table(name = "candidatos")
public class Candidato {

    @Id
    @Column(name = "id_candidatos", length = 50)
    private String idCandidatos;

    @Column(name = "id_partido", nullable = false, length = 50)
    private String idPartido;

    @Column(name = "id_categoria", nullable = false, length = 50)
    private String idCategoria;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "apellidos", nullable = false, length = 100)
    private String apellidos;

    @Column(name = "genero", length = 20)
    private String genero;

    @Column(name = "url_imagen", length = 255)
    private String urlImagen;

    @Column(name = "descripcion_propuesta", columnDefinition = "TEXT")
    private String descripcionPropuesta;

    @Column(name = "tema", length = 255)
    private String tema;

    // ============================================
    // CONSTRUCTORES
    // ============================================
    public Candidato() {
    }

    public Candidato(String idCandidatos, String idPartido, String idCategoria, 
                     String nombre, String apellidos) {
        this.idCandidatos = idCandidatos;
        this.idPartido = idPartido;
        this.idCategoria = idCategoria;
        this.nombre = nombre;
        this.apellidos = apellidos;
    }

    // ============================================
    // GETTERS Y SETTERS
    // ============================================
    public String getIdCandidatos() {
        return idCandidatos;
    }

    public void setIdCandidatos(String idCandidatos) {
        this.idCandidatos = idCandidatos;
    }

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

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public String getUrlImagen() {
        return urlImagen;
    }

    public void setUrlImagen(String urlImagen) {
        this.urlImagen = urlImagen;
    }

    public String getDescripcionPropuesta() {
        return descripcionPropuesta;
    }

    public void setDescripcionPropuesta(String descripcionPropuesta) {
        this.descripcionPropuesta = descripcionPropuesta;
    }

    public String getTema() {
        return tema;
    }

    public void setTema(String tema) {
        this.tema = tema;
    }

    // ============================================
    // MÉTODOS AUXILIARES
    // ============================================
    public String getNombreCompleto() {
        return nombre + " " + apellidos;
    }

    @Override
    public String toString() {
        return "Candidato{" +
                "idCandidatos='" + idCandidatos + '\'' +
                ", nombre='" + nombre + '\'' +
                ", apellidos='" + apellidos + '\'' +
                ", partido='" + idPartido + '\'' +
                '}';
    }
}