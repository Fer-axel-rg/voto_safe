package com.voto_safe.voto_safe.backend.repository;

import com.voto_safe.voto_safe.backend.model.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, String> {
    // Busca automáticamente en la BD por DNI
    Optional<Usuario> findByDni(String dni);
}