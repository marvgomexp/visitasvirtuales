package com.ies.tour.visitasvirtuales_backend.repository;

import com.ies.tour.visitasvirtuales_backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Método necesario para el Login/Spring Security
    Usuario findByEmail(String email);

    /*
     * // Opcional si el login es por nombre de usuario
     * Usuario findByNombre(String nombre);
     */

}
