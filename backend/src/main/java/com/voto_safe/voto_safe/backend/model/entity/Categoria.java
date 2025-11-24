package com.voto_safe.voto_safe.backend.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "categorias")
public class Categoria {

    @Id
    @Column(name = "id_categorias") // Ojo: En tu script SQL le pusiste id_categorias (plural)
    private String idCategoria;

    private String nombre;
    private String descripcion;

    // RELACIÓN: Muchas categorías pertenecen a Una elección
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_eleccion")
    @JsonIgnore // Vital: Para que al pedir una categoría no te traiga la elección entera y haga bucle
    private Election eleccion;

    // --- Getters y Setters ---
    public String getIdCategoria() { return idCategoria; }
    public void setIdCategoria(String idCategoria) { this.idCategoria = idCategoria; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Election getEleccion() { return eleccion; }
    public void setEleccion(Election eleccion) { this.eleccion = eleccion; }
}