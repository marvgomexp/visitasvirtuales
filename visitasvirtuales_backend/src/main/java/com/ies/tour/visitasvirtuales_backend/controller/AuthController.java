package com.ies.tour.visitasvirtuales_backend.controller;

import com.ies.tour.visitasvirtuales_backend.dto.LoginRequest;
import com.ies.tour.visitasvirtuales_backend.dto.RegisterRequest;
import com.ies.tour.visitasvirtuales_backend.model.Usuario;
import com.ies.tour.visitasvirtuales_backend.model.RolUsuario;
import com.ies.tour.visitasvirtuales_backend.service.Usuarioservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController // Indica que esta clase maneja las peticiones REST
@RequestMapping("api/auth") // Ruta para los endpoints de autenticación
public class AuthController {
    private final Usuarioservice usuarioservice;

    @Autowired
    public AuthController(Usuarioservice usuarioservice) {
        this.usuarioservice = usuarioservice;
    }

    // ENDPOINT DE REGISTRO
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {

        // 1. Validación: Comprueba si el email ya existe
        if (usuarioservice.findByEmail(request.getEmail()) != null) {
            return new ResponseEntity<>("El email ya esta en uso.", HttpStatus.BAD_REQUEST);
        }

        // 2. Mapear DTO a Entidad
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombre(request.getNombre());
        nuevoUsuario.setEmail(request.getEmail());
        nuevoUsuario.setPassword(request.getPassword());

        // 3. Asignar rol por defecto
        // Se asigna el rol 'alumno' si no se especifica
        try {
            nuevoUsuario.setRol(RolUsuario.valueOf(request.getRol().toLowerCase()));
        } catch (IllegalArgumentException e) {
            nuevoUsuario.setRol(RolUsuario.alumno); // Rol por defecto
        }

        // 4. Guardar en la base de datos
        Usuario usuarioGuardado = usuarioservice.save(nuevoUsuario);

        // Devolver respuesta exitosa
        return new ResponseEntity<>(usuarioGuardado, HttpStatus.CREATED);
    }

    // ENDPOINT DE LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest request) {
        // Simplemente busca el usuario sin verificación de password
        Usuario usuario = usuarioservice.findByEmail(request.getEmail());

        if (usuario != null) {
            // Cuando se implemente la seguridad, este endpoint devolvera un Token
            return new ResponseEntity<>("Usuario encontrado.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Credenciales inválidas.", HttpStatus.UNAUTHORIZED);
        }
    }
}
