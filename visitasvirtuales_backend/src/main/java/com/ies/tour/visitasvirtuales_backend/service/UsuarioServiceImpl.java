package com.ies.tour.visitasvirtuales_backend.service;

import com.ies.tour.visitasvirtuales_backend.model.Usuario;
import com.ies.tour.visitasvirtuales_backend.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Service
public class UsuarioServiceImpl implements UsuarioService, UserDetailsService {

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

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email);

        if (usuario == null) {
            // Spring Security lanza esta excepción si no encuentra al usuario
            throw new UsernameNotFoundException("Usuario no encontrado con email: " + email);
        }

        // Inicializamos la colección de autoridades
        Collection<GrantedAuthority> authorities;

        if (usuario.getRol() == null) {
            // Si el rol es nulo en la BD, se asigna una lista vacía de permisos
            System.err.println("ADVERTENCIA CRÍTICA: El usuario " + email
                    + " NO TIENE ROL ASIGNADO en la BD. Se asignan permisos vacíos.");
            authorities = Collections.emptyList();
        } else {
            // Si el rol existe, lo creamos con el prefijo "ROLE_"
            String roleName = "ROLE_" + usuario.getRol().name().toUpperCase();
            authorities = Collections.singletonList(new SimpleGrantedAuthority(roleName));
        }

        // Mapeamos la entidad Usuario a un objeto UserDetails de Spring Security
        return new org.springframework.security.core.userdetails.User(
                usuario.getEmail(),
                usuario.getPassword(),
                authorities // Usamos la colección de autoridades comprobada
        );
    }
}