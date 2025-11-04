package com.ies.tour.visitasvirtuales_backend.service;

import com.ies.tour.visitasvirtuales_backend.model.Usuario;

public interface Usuarioservice {
    // Método para que Spring Security encuentre al usuario por email
    Usuario findByEmail(String email);

    // Método para registrar nuevos usuarios (los administradores podrán crear
    // usuarios)
    Usuario save(Usuario usuarios);

    // Se pueden añadir más métodos como encontrar por ID, actualizar, etc.
}
