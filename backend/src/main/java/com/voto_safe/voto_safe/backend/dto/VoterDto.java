package com.voto_safe.voto_safe.backend.dto;

import java.time.LocalDate;

public class VoterDto {

    // 1. Para las Tarjetas de Arriba (Contadores)
    public static class VoterStatsDTO {
        public long total;
        public long votaron;
        public long noVotaron;
        public long admins;
        public long users;

        public VoterStatsDTO(long total, long votaron, long noVotaron, long admins, long users) {
            this.total = total;
            this.votaron = votaron;
            this.noVotaron = noVotaron;
            this.admins = admins;
            this.users = users;
        }
    }

    // 2. Para cada Fila de la Tabla
    public static class VoterRowDTO {
        public String dni;
        public String nombres;
        public String apellidos;
        public LocalDate fechaNacimiento; // O String si prefieres formatear en Java
        public String tipo; // 'admin' o 'user'
        public String departamento;
        public String estado; // 'voto' o 'no voto'
        public String eleccion; // Nombre de la elección (opcional por ahora)

        public VoterRowDTO(String dni, String nombres, String apellidos, LocalDate fechaNacimiento, String tipo, String departamento, String estado, String eleccion) {
            this.dni = dni;
            this.nombres = nombres;
            this.apellidos = apellidos;
            this.fechaNacimiento = fechaNacimiento;
            this.tipo = tipo;
            this.departamento = departamento;
            this.estado = estado;
            this.eleccion = eleccion;
        }
    }
}