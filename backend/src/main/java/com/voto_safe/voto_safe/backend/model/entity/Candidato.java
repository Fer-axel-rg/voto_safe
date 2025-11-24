package com.voto_safe.voto_safe.backend.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "candidatos")
public class Candidato {

    @Id
    @Column(name = "id_candidatos") // Revisa si es singular o plural en tu BD
    private String idCandidato;

    private String nombre;
    private String apellidos;
    private String genero;
    
    @Column(name = "url_imagen")
    private String urlImagen;
    
    @Column(name = "descripcion_propuesta")
    private String descripcionPropuesta;
    
    private String tema;

    // RELACIÓN: Muchos candidatos -> Un Partido
    @ManyToOne
    @JoinColumn(name = "id_partido")
    @JsonIgnore
    private Partido partido;
    
    // Opcional: Relación con Categoría si la necesitas
    @Column(name = "id_categoria") 
    private String idCategoria;

    // --- Getters y Setters ---
    public String getIdCandidato() { return idCandidato; }
    public void setIdCandidato(String id) { this.idCandidato = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellidos() { return apellidos; }
    public void setApellidos(String apellidos) { this.apellidos = apellidos; }

    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }

    public String getUrlImagen() { return urlImagen; }
    public void setUrlImagen(String url) { this.urlImagen = url; }

    public String getDescripcionPropuesta() { return descripcionPropuesta; }
    public void setDescripcionPropuesta(String d) { this.descripcionPropuesta = d; }

    public String getTema() { return tema; }
    public void setTema(String tema) { this.tema = tema; }

    public Partido getPartido() { return partido; }
    public void setPartido(Partido partido) { this.partido = partido; }
    
    public String getIdCategoria() { return idCategoria; }
    public void setIdCategoria(String id) { this.idCategoria = id; }
}