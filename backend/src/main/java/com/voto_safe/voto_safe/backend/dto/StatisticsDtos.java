package com.voto_safe.voto_safe.backend.dto;

import java.util.List;

public class StatisticsDtos {

    // 1. Respuesta completa para la página de estadísticas
    public static class ElectionResultsDTO {
        public String electionName;
        public long totalVotes; // Total de votos emitidos
        public long totalVoters; // Total de personas habilitadas
        public double participationPercentage; // % de gente que fue a votar
        public List<PartyResultDTO> results;
        public String winningCandidate; // El que va ganando
        public String state; // Estado de la elección

        public ElectionResultsDTO(String electionName, long totalVotes, long totalVoters, double participationPercentage, List<PartyResultDTO> results, String winningCandidate, String state) {
            this.electionName = electionName;
            this.totalVotes = totalVotes;
            this.totalVoters = totalVoters;
            this.participationPercentage = participationPercentage;
            this.results = results;
            this.winningCandidate = winningCandidate;
            this.state = state;
        }
    }

    // 2. Datos para el gráfico de barras/pastel
    public static class PartyResultDTO {
        public String partyName;
        public String partyLogo;
        public long votes;
        public double percentage;
        public String color; // Opcional, para el gráfico

        public PartyResultDTO(String partyName, String partyLogo, long votes, double percentage, String color) {
            this.partyName = partyName;
            this.partyLogo = partyLogo;
            this.votes = votes;
            this.percentage = percentage;
            this.color = color;
        }
    }
}