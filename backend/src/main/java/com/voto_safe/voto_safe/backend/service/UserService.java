package com.voto_safe.voto_safe.backend.service;

import com.voto_safe.voto_safe.backend.dto.VoterDto.VoterRowDTO;
import com.voto_safe.voto_safe.backend.dto.VoterDto.VoterStatsDTO;
import com.voto_safe.voto_safe.backend.model.entity.*;
import com.voto_safe.voto_safe.backend.repository.UsuarioRepository;
import com.voto_safe.voto_safe.backend.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.Collections;

@Service
public class UserService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private VoteRepository voteRepository;

    public VoterStatsDTO getStats() {
        long total = usuarioRepository.count();
        long admins = usuarioRepository.countByTipoUsuario("admin");
        long users = usuarioRepository.countByTipoUsuario("user");
        
        long votaron = voteRepository.count(); 
        long noVotaron = total - votaron;
        if (noVotaron < 0) noVotaron = 0;

        return new VoterStatsDTO(total, votaron, noVotaron, admins, users);
    }

    public List<VoterRowDTO> getUsers(String search) {
        // 1. Traemos los usuarios (1 Consulta)
        List<Usuario> usuarios;
        if (search == null || search.trim().isEmpty()) {
            usuarios = usuarioRepository.findAll();
        } else {
            usuarios = usuarioRepository.searchUsers(search);
        }

        if (usuarios.isEmpty()) {
            return Collections.emptyList();
        }

        // 2. Extraemos la lista de IDs de los usuarios encontrados
        List<String> userIds = usuarios.stream()
                .map(Usuario::getIdUsuario)
                .collect(Collectors.toList());

        // 3. OPTIMIZACIÓN: Traemos TODOS los votos de estos usuarios en (1 Consulta)
        List<Voto> votosEncontrados = voteRepository.findByIdUsuarioIn(userIds);

        // 4. Convertimos la lista de votos a un MAPA para búsqueda instantánea en memoria
        // Clave: idUsuario, Valor: Objeto Voto
        Map<String, Voto> mapaVotos = votosEncontrados.stream()
                .collect(Collectors.toMap(Voto::getIdUsuario, Function.identity(), (v1, v2) -> v1));

        // 5. Cruzamos los datos en memoria (Sin ir a la base de datos)
        return usuarios.stream()
                .map(u -> mapToDTO(u, mapaVotos.get(u.getIdUsuario())))
                .collect(Collectors.toList());
    }

    // Método modificado para recibir el Voto directamente (ya no hace consultas)
    private VoterRowDTO mapToDTO(Usuario u, Voto votoEncontrado) {
        String estadoVoto;
        String nombreEleccion;

        if (votoEncontrado != null) {
            estadoVoto = "voto";
            nombreEleccion = votoEncontrado.getNombreEleccion(); 
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
            nombreEleccion
        );
    }
}