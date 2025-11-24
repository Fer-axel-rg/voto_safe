package com.voto_safe.voto_safe.backend.service;

import com.voto_safe.voto_safe.backend.dto.StatisticsDtos.ElectionResultsDTO;
import com.voto_safe.voto_safe.backend.dto.StatisticsDtos.PartyResultDTO;
import com.voto_safe.voto_safe.backend.model.entity.Election;
import com.voto_safe.voto_safe.backend.repository.ElectionRepository;
import com.voto_safe.voto_safe.backend.repository.UsuarioRepository;
import com.voto_safe.voto_safe.backend.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StatisticsService {

    @Autowired private VoteRepository voteRepository;
    @Autowired private ElectionRepository electionRepository;
    @Autowired private UsuarioRepository usuarioRepository;

    public ElectionResultsDTO getResults(String electionId) {
        // 1. Obtener datos generales
        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new RuntimeException("Elección no encontrada"));

        long totalVotes = voteRepository.countByIdEleccion(electionId);
        long totalVoters = usuarioRepository.count(); 

        double participation = (totalVoters > 0) ? ((double) totalVotes / totalVoters) * 100 : 0;

        // 2. Obtener desglose por partido
        List<Object[]> rawResults = voteRepository.countVotesByParty(electionId);
        List<PartyResultDTO> partyResults = new ArrayList<>();

        String winner = "Esperando datos...";
        long maxVotes = -1;
        boolean tie = false;

        String[] colors = {"#3b82f6", "#10b981", "#ef4444", "#8b5cf6", "#f59e0b", "#6366f1"};
        int colorIndex = 0;

        if (rawResults != null) {
            for (Object[] row : rawResults) {
                // --- CORRECCIÓN DE CASTING ---
                // Usamos String.valueOf para evitar ClassCastException si viene un número o algo raro
                String name = (row[0] != null) ? String.valueOf(row[0]) : "Sin Nombre";
                String logo = (row[1] != null) ? String.valueOf(row[1]) : "";
                
                // Conversión segura de número (Postgres COUNT devuelve BigInteger o Long)
                long votes = 0;
                if (row[2] instanceof Number) {
                    votes = ((Number) row[2]).longValue();
                }
                // -----------------------------

                double percentage = (totalVotes > 0) ? ((double) votes / totalVotes) * 100 : 0;
                percentage = Math.round(percentage * 10.0) / 10.0;

                partyResults.add(new PartyResultDTO(
                    name, 
                    logo, 
                    votes, 
                    percentage, 
                    colors[colorIndex % colors.length]
                ));
                colorIndex++;

                if (votes > maxVotes) {
                    maxVotes = votes;
                    winner = name;
                    tie = false;
                } else if (votes == maxVotes && votes > 0) {
                    tie = true;
                }
            }
        }
        
        if (totalVotes == 0) winner = "Sin votos registrados";
        else if (tie) winner = "Empate técnico";

        return new ElectionResultsDTO(
            election.getNombre(),
            totalVotes,
            totalVoters,
            Math.round(participation * 10.0) / 10.0,
            partyResults,
            winner,
            election.getEstado()
        );
    }
}