package com.voto_safe.voto_safe.backend.model.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
 // Importar
import java.util.List;

@Entity
@Table(name = "elecciones") // Nombre exacto de tu tabla
public class Election {



    @Id
    @Column(name = "id_eleccion") // Tu PK
    private String idEleccion;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion; // Campo nuevo que vi en tu imagen

    @Column(name = "tipo_eleccion")
    private String tipoEleccion;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio; // Usamos LocalDate (solo fecha)

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(name = "estado")
    private String estado; // 'active', 'upcoming', 'finished'



    // 👇 AGREGAR ESTO 👇
    @OneToMany(mappedBy = "eleccion", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Categoria> categorias = new ArrayList<>();

    // --- Getter y Setter para la lista ---
    public List<Categoria> getCategorias() { return categorias; }
    
    public void setCategorias(List<Categoria> categorias) {
        this.categorias.clear();
        if (categorias != null) {
            this.categorias.addAll(categorias);
        }
    }
    
    // Helper para agregar manteniendo la relación
    public void addCategoria(Categoria categoria) {
        categoria.setEleccion(this); // Vinculamos la hija al padre
        this.categorias.add(categoria);
    }


    // --- Getters y Setters ---
    public String getIdEleccion() { return idEleccion; }
    public void setIdEleccion(String idEleccion) { this.idEleccion = idEleccion; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getTipoEleccion() { return tipoEleccion; }
    public void setTipoEleccion(String tipoEleccion) { this.tipoEleccion = tipoEleccion; }

    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }

    public LocalDate getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDate fechaFin) { this.fechaFin = fechaFin; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}