package com.voto_safe.voto_safe.backend.model.entity;

import java.util.ArrayList;
 // <--- FALTABA ESTO
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "partidos")
public class Partido {

    @Id
    @Column(name = "id_partido")
    private String idPartido;

    // Campo nuevo según tu imagen
    @Column(name = "id_categoria")
    private String idCategoria;

    private String nombre;
    private String descripcion;

    @Column(name = "url_logo")
    private String urlLogo;

    // RELACIÓN: Este es el famoso "id_eleccion" de tu imagen
    // Java lo maneja como un objeto completo 'Election', pero en la BD es solo un ID.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_eleccion") 
    @JsonIgnore // Importante para no crear bucles infinitos al enviar JSON
    private Election eleccion;

    @OneToMany(mappedBy = "partido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Candidato> candidatos = new ArrayList<>();
    
    // Getter y Setter
    

    // --- Getters y Setters ---
    public String getIdPartido() { return idPartido; }
    public void setIdPartido(String idPartido) { this.idPartido = idPartido; }

    public String getIdCategoria() { return idCategoria; }
    public void setIdCategoria(String idCategoria) { this.idCategoria = idCategoria; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getUrlLogo() { return urlLogo; }
    public void setUrlLogo(String urlLogo) { this.urlLogo = urlLogo; }

    public Election getEleccion() { return eleccion; }
    public void setEleccion(Election eleccion) { this.eleccion = eleccion; }

    public List<Candidato> getCandidatos() { return candidatos; }
    public void setCandidatos(List<Candidato> candidatos) {
        this.candidatos.clear();
        if (candidatos != null) {
            candidatos.forEach(c -> c.setPartido(this)); // Vincular
            this.candidatos.addAll(candidatos);
        }
    }
}