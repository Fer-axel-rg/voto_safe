package com.voto_safe.voto_safe.backend.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "detalle_votos")
public class DetalleVoto {

    @Id
    @Column(name = "id_detalle_voto")
    private String idDetalleVoto;

    @Column(name = "id_eleccion")
    private String idEleccion;

    @Column(name = "id_categoria")
    private String idCategoria;

    @Column(name = "nombre_categoria")
    private String nombreCategoria;

    @Column(name = "id_partido")
    private String idPartido;

    @Column(name = "nombre_partido")
    private String nombrePartido;
    
    // Opcional: Si es voto preferencial
    @Column(name = "id_candidato")
    private String idCandidato;

    // RELACIÓN: Pertenece a un Voto padre
    @ManyToOne
    @JoinColumn(name = "id_voto")
    @JsonIgnore
    private Voto voto;

    // --- Getters y Setters ---
    public String getIdDetalleVoto() { return idDetalleVoto; }
    public void setIdDetalleVoto(String idDetalleVoto) { this.idDetalleVoto = idDetalleVoto; }

    public String getIdEleccion() { return idEleccion; }
    public void setIdEleccion(String idEleccion) { this.idEleccion = idEleccion; }

    public String getIdCategoria() { return idCategoria; }
    public void setIdCategoria(String idCategoria) { this.idCategoria = idCategoria; }

    public String getNombreCategoria() { return nombreCategoria; }
    public void setNombreCategoria(String nombreCategoria) { this.nombreCategoria = nombreCategoria; }

    public String getIdPartido() { return idPartido; }
    public void setIdPartido(String idPartido) { this.idPartido = idPartido; }

    public String getNombrePartido() { return nombrePartido; }
    public void setNombrePartido(String nombrePartido) { this.nombrePartido = nombrePartido; }

    public String getIdCandidato() { return idCandidato; }
    public void setIdCandidato(String idCandidato) { this.idCandidato = idCandidato; }

    public Voto getVoto() { return voto; }
    public void setVoto(Voto voto) { this.voto = voto; }
}