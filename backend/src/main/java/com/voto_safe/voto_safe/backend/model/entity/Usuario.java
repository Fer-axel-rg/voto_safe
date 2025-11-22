package com.voto_safe.voto_safe.backend.model.entity;
import java.time.LocalDate;

import jakarta.persistence.*;



@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id 
    @Column(name = "id_usuario")
    private String idUsuario;
   
    @Column(unique = true)
    private String dni;

    @Column(name = "nombres")
    private String nombres;

    @Column(name = "apellidos")
    private String apellidos;

    @Column(name="fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Column(name = "tipo_usuario")
    private String tipoUsuario;


    private String departamento;
    private String provincia;
    private String direccion;
    private String distrito;
    private String telefono;
    private Boolean activo;


    // Getters and Setters
    public String getIdUsuario() {
        return idUsuario;
    }
    public void setIdUsuario(String idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getDni() {
        return dni;
    }
    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getNombres() {
        return nombres;
    }
    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getApellidos() {
        return apellidos;
    }
    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }
    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getTipoUsuario() {
        return tipoUsuario;
    }
    public void setTipoUsuario(String tipoUsuario) {
        this.tipoUsuario = tipoUsuario;
    }

    public String getDepartamento() {
        return departamento;
    }
    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }

    public String getProvincia() {
        return provincia;
    }
    public void setProvincia(String provincia) {
        this.provincia = provincia;
    }

    public String getDistrito() {
        return distrito;
    }
    public void setDistrito(String distrito) {
        this.distrito = distrito;
    }

    public String getTelefono() {
        return telefono;
    }
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public Boolean getActivo() {
        return activo;
    }
    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public String getDireccion() {
        return direccion;
    }
    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
}