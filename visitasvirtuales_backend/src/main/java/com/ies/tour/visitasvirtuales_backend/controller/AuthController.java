package com.ies.tour.visitasvirtuales_backend.controller;

import com.ies.tour.visitasvirtuales_backend.dto.LoginRequest;
import com.ies.tour.visitasvirtuales_backend.dto.RegisterRequest;
import com.ies.tour.visitasvirtuales_backend.model.Usuario;
import com.ies.tour.visitasvirtuales_backend.model.RolUsuario;
import com.ies.tour.visitasvirtuales_backend.service.UsuarioService;
import com.ies.tour.visitasvirtuales_backend.security.jwt.JwtUtils;
import com.ies.tour.visitasvirtuales_backend.payload.response.JwtResponse;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.stream.Collectors;

@RestController
@RequestMapping("api/auth")
public class AuthController {
    private final UsuarioService usuarioservice;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @Autowired
    public AuthController(UsuarioService usuarioservice,
            AuthenticationManager authenticationManager,
            JwtUtils jwtUtils) {
        this.usuarioservice = usuarioservice;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    // ENDPOINT DE REGISTRO
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {

        if (usuarioservice.findByEmail(request.getEmail()) != null) {
            return new ResponseEntity<>("El email ya esta en uso.", HttpStatus.BAD_REQUEST);
        }

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombre(request.getNombre());
        nuevoUsuario.setEmail(request.getEmail());
        nuevoUsuario.setPassword(request.getPassword());

        try {
            nuevoUsuario.setRol(RolUsuario.valueOf(request.getRol().toUpperCase())); // Usar toUpperCase para la
                                                                                     // conversión
        } catch (IllegalArgumentException e) {
            nuevoUsuario.setRol(RolUsuario.alumno);
        }

        Usuario usuarioGuardado = usuarioservice.save(nuevoUsuario);

        return new ResponseEntity<>(usuarioGuardado, HttpStatus.CREATED);
    }

    // ENDPOINT DE LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 1. GENERAR EL TOKEN
        String jwt = jwtUtils.generateJwtToken(authentication);

        // 2. Extraer detalles para respuesta
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // Suponiendo que solo se tiene un rol
        String rol = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()).get(0);
        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getUsername(), rol));
    }
}