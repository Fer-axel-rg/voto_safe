package com.voto_safe.voto_safe.backend.model.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Entidad que representa una ELECCIÓN
 * Mapea a la tabla 'elecciones' en Supabase
 */
@Entity
@Table(name = "elecciones")
public class Eleccion {

    @Id
    @Column(name = "id_eleccion", length = 50)
    private String idEleccion;

    @Column(name = "nombre", nullable = false, length = 255)
    private String nombre;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "tipo_eleccion", length = 100)
    private String tipoEleccion; // "Presidencial", "Municipal", "Otros"

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(name = "estado", length = 50)
    private String estado; // "active", "upcoming", "finished"

    // ============================================
    // CONSTRUCTORES
    // ============================================
    public Eleccion() {
    }

    public Eleccion(String idEleccion, String nombre, String tipoEleccion, 
                    LocalDate fechaInicio, LocalDate fechaFin, String estado) {
        this.idEleccion = idEleccion;
        this.nombre = nombre;
        this.tipoEleccion = tipoEleccion;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.estado = estado;
    }

    // ============================================
    // GETTERS Y SETTERS
    // ============================================
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

    public String getTipoEleccion() {
        return tipoEleccion;
    }

    public void setTipoEleccion(String tipoEleccion) {
        this.tipoEleccion = tipoEleccion;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    // ============================================
    // MÉTODOS AUXILIARES
    // ============================================
    
    /**
     * Verificar si la elección está activa actualmente
     */
    public boolean isActive() {
        if (!"active".equals(this.estado)) {
            return false;
        }
        LocalDate hoy = LocalDate.now();
        return !hoy.isBefore(fechaInicio) && !hoy.isAfter(fechaFin);
    }

    /**
     * Verificar si la elección es próxima (upcoming)
     */
    public boolean isUpcoming() {
        if (!"upcoming".equals(this.estado)) {
            return false;
        }
        LocalDate hoy = LocalDate.now();
        return hoy.isBefore(fechaInicio);
    }

    /**
     * Verificar si la elección ya finalizó
     */
    public boolean isFinished() {
        if ("finished".equals(this.estado)) {
            return true;
        }
        LocalDate hoy = LocalDate.now();
        return hoy.isAfter(fechaFin);
    }

    @Override
    public String toString() {
        return "Eleccion{" +
                "idEleccion='" + idEleccion + '\'' +
                ", nombre='" + nombre + '\'' +
                ", tipoEleccion='" + tipoEleccion + '\'' +
                ", fechaInicio=" + fechaInicio +
                ", fechaFin=" + fechaFin +
                ", estado='" + estado + '\'' +
                '}';
    }
}