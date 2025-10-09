package com.ies.tour.visitasvirtuales_backend.service;

import com.ies.tour.visitasvirtuales_backend.model.Usuario;
import com.ies.tour.visitasvirtuales_backend.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections; // Permisos básicos

@Service
public class UsuarioServiceImpl implements Usuarioservice, UserDetailsService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    // Inyección de dependencia del Repositorio
    @Autowired
    public UsuarioServiceImpl(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // LÓGICA DE NEGOCIO
    // Usamos el método definido en el repositorio para buscar por email
    @Override
    @Transactional(readOnly = true) // Operaciones de solo lectura
    public Usuario findByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    // Guardar un usuario
    @Override
    @Transactional
    public Usuario save(Usuario usuarios) {
        // Se cifra la contraseña antes de guardar
        usuarios.setPassword(passwordEncoder.encode(usuarios.getPassword()));
        return usuarioRepository.save(usuarios);
    }

    // Implementación de UserDetailsService
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email);

        if (usuario == null) {
            // Spring Security lanza esta excepción si no encuentra al usuario
            throw new UsernameNotFoundException("Usuario no encontrado con email: " + email);
        }
        // Mapeamos la entidad Usuario a un objeto UserDetails de Spring Security
        return new org.springframework.security.core.userdetails.User(
                usuario.getEmail(),
                usuario.getPassword(),
                Collections.singleton(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                        "ROLE_" + usuario.getRol().name().toUpperCase())));
    }
}
