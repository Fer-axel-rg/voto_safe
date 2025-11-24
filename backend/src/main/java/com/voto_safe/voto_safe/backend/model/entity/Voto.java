package com.voto_safe.voto_safe.backend.model.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Entidad que representa un VOTO (registro principal)
 * Mapea a la tabla 'votos' en Supabase
 * 
 * IMPORTANTE: Esta tabla guarda el registro general del voto
 * Los votos específicos por categoría se guardan en 'detalle_votos'
 */
@Entity
@Table(name = "votos")
public class Voto {

    @Id
    @Column(name = "id_voto", length = 50)
    private String idVoto;

    @Column(name = "id_usuario", nullable = false, length = 50)
    private String idUsuario;

    @Column(name = "id_eleccion", nullable = false, length = 50)
    private String idEleccion;

    @Column(name = "nombre_eleccion", length = 255)
    private String nombreEleccion;

    @Column(name = "fecha_voto", nullable = false)
    private LocalDate fechaVoto;

    @Column(name = "informacion_dispositivo", columnDefinition = "TEXT")
    private String informacionDispositivo;

    // ============================================
    // CONSTRUCTORES
    // ============================================
    public Voto() {
    }

    public Voto(String idVoto, String idUsuario, String idEleccion, 
                String nombreEleccion, LocalDate fechaVoto) {
        this.idVoto = idVoto;
        this.idUsuario = idUsuario;
        this.idEleccion = idEleccion;
        this.nombreEleccion = nombreEleccion;
        this.fechaVoto = fechaVoto;
    }

    // ============================================
    // GETTERS Y SETTERS
    // ============================================
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

    public String getNombreEleccion() {
        return nombreEleccion;
    }

    public void setNombreEleccion(String nombreEleccion) {
        this.nombreEleccion = nombreEleccion;
    }

    public LocalDate getFechaVoto() {
        return fechaVoto;
    }

    public void setFechaVoto(LocalDate fechaVoto) {
        this.fechaVoto = fechaVoto;
    }

    public String getInformacionDispositivo() {
        return informacionDispositivo;
    }

    public void setInformacionDispositivo(String informacionDispositivo) {
        this.informacionDispositivo = informacionDispositivo;
    }

    // ============================================
    // MÉTODOS AUXILIARES
    // ============================================
    
    /**
     * Verificar si el voto fue emitido hoy
     */
    public boolean isVotedToday() {
        return fechaVoto != null && fechaVoto.equals(LocalDate.now());
    }

    /**
     * Obtener días desde que se emitió el voto
     */
    public long getDaysSinceVote() {
        if (fechaVoto == null) {
            return 0;
        }
        return java.time.temporal.ChronoUnit.DAYS.between(fechaVoto, LocalDate.now());
    }

    @Override
    public String toString() {
        return "Voto{" +
                "idVoto='" + idVoto + '\'' +
                ", idUsuario='" + idUsuario + '\'' +
                ", idEleccion='" + idEleccion + '\'' +
                ", nombreEleccion='" + nombreEleccion + '\'' +
                ", fechaVoto=" + fechaVoto +
                '}';
    }
}