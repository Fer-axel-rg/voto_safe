package com.voto_safe.voto_safe.backend.repository;

import com.voto_safe.voto_safe.backend.model.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, String> {
    
    Optional<Usuario> findByDni(String dni);

    // Contar por rol ('admin' o 'user')
    long countByTipoUsuario(String tipoUsuario);

    // BUSCADOR: Busca coincidencias en DNI, Nombre o Apellido (Ignora mayúsculas)
    @Query("SELECT u FROM Usuario u WHERE " +
           "LOWER(u.nombres) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.apellidos) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "u.dni LIKE CONCAT('%', :search, '%')")
    List<Usuario> searchUsers(@Param("search") String search);
}