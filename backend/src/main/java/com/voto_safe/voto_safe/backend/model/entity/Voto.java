package com.voto_safe.voto_safe.backend.model.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "votos")
public class Voto {

    @Id
    @Column(name = "id_voto")
    private String idVoto;

    @Column(name = "id_usuario")
    private String idUsuario;

    @Column(name = "id_eleccion")
    private String idEleccion;

    @Column(name = "nombre_eleccion")
    private String nombreEleccion;

    @Column(name = "fecha_voto")
    private LocalDateTime fechaVoto;

    @Column(name = "informacion_dispositivo")
    private String informacionDispositivo;

    // RELACIÓN: Un voto tiene varios detalles (ej: Presidente + Congresista)
    @OneToMany(mappedBy = "voto", cascade = CascadeType.ALL)
    private List<DetalleVoto> detalles;

    // --- Getters y Setters ---
    public String getIdVoto() { return idVoto; }
    public void setIdVoto(String idVoto) { this.idVoto = idVoto; }

    public String getIdUsuario() { return idUsuario; }
    public void setIdUsuario(String idUsuario) { this.idUsuario = idUsuario; }

    public String getIdEleccion() { return idEleccion; }
    public void setIdEleccion(String idEleccion) { this.idEleccion = idEleccion; }

    public String getNombreEleccion() { return nombreEleccion; }
    public void setNombreEleccion(String nombreEleccion) { this.nombreEleccion = nombreEleccion; }

    public LocalDateTime getFechaVoto() { return fechaVoto; }
    public void setFechaVoto(LocalDateTime fechaVoto) { this.fechaVoto = fechaVoto; }

    public String getInformacionDispositivo() { return informacionDispositivo; }
    public void setInformacionDispositivo(String informacionDispositivo) { this.informacionDispositivo = informacionDispositivo; }

    public List<DetalleVoto> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleVoto> detalles) { this.detalles = detalles; }
}