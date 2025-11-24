package com.voto_safe.voto_safe.backend.service;

import com.voto_safe.voto_safe.backend.dto.VoterDto.VoterRowDTO;
import com.voto_safe.voto_safe.backend.dto.VoterDto.VoterStatsDTO;
import com.voto_safe.voto_safe.backend.model.entity.*;
import com.voto_safe.voto_safe.backend.repository.UsuarioRepository;
import com.voto_safe.voto_safe.backend.repository.VoteRepository; // <--- IMPORTANTE
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private VoteRepository voteRepository; // <--- INYECCIÓN NUEVA

    public VoterStatsDTO getStats() {
        long total = usuarioRepository.count();
        long admins = usuarioRepository.countByTipoUsuario("admin");
        long users = usuarioRepository.countByTipoUsuario("user");
        
        // AHORA SÍ CONTAMOS LOS VOTOS REALES (Total de votos emitidos únicos)
        long votaron = voteRepository.count(); 
        long noVotaron = total - votaron;
        if (noVotaron < 0) noVotaron = 0; // Seguridad

        return new VoterStatsDTO(total, votaron, noVotaron, admins, users);
    }

    public List<VoterRowDTO> getUsers(String search) {
        List<Usuario> usuarios;

        if (search == null || search.trim().isEmpty()) {
            usuarios = usuarioRepository.findAll();
        } else {
            usuarios = usuarioRepository.searchUsers(search);
        }

        return usuarios.stream().map(this::mapToDTO).collect(Collectors.toList());
    }
private VoterRowDTO mapToDTO(Usuario u) {
        // 1. Buscamos si tiene algún voto registrado
        // (Usamos findFirst porque asumimos que por ahora solo votan en una a la vez)
        var votoOpt = voteRepository.findFirstByIdUsuario(u.getIdUsuario());
        
        String estadoVoto;
        String nombreEleccion;

        if (votoOpt.isPresent()) {
            estadoVoto = "voto";
            // ¡AQUÍ ESTÁ EL CAMBIO! Sacamos el nombre real de la tabla votos
            nombreEleccion = votoOpt.get().getNombreEleccion(); 
        } else {
            estadoVoto = "no voto";
            nombreEleccion = "Pendiente";
        }

        return new VoterRowDTO(
            u.getDni(),
            u.getNombres(),
            u.getApellidos(),
            u.getFechaNacimiento(),
            u.getTipoUsuario(),
            u.getDepartamento(),
            estadoVoto,
            nombreEleccion // Enviamos el nombre real
        );
    }
}