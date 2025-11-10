package com.ies.tour.visitasvirtuales_backend.service;

import com.ies.tour.visitasvirtuales_backend.model.Usuario;
import com.ies.tour.visitasvirtuales_backend.repository.UsuarioRepository;
import com.ies.tour.visitasvirtuales_backend.dto.PuntoDeInteresDTO;
import com.ies.tour.visitasvirtuales_backend.model.PuntoDeInteres;
import com.ies.tour.visitasvirtuales_backend.repository.PuntoDeInteresRepository;
import com.ies.tour.visitasvirtuales_backend.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PuntoDeInteresServiceImpl implements PuntoDeInteresService {

    private final PuntoDeInteresRepository puntoDeInteresRepository;
    private final UsuarioRepository usuarioRepository;

    @Autowired
    public PuntoDeInteresServiceImpl(PuntoDeInteresRepository puntoDeInteresRepository,
            UsuarioRepository usuarioRepository) {
        this.puntoDeInteresRepository = puntoDeInteresRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PuntoDeInteres> findAll() {
        return puntoDeInteresRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PuntoDeInteres> findById(Integer id) {
        return puntoDeInteresRepository.findById(id);
    }

    @Override
    @Transactional
    public void deleteById(Integer id) {
        puntoDeInteresRepository.deleteById(id);
    }

    @Override
    @Transactional
    public PuntoDeInteres saveFromDto(PuntoDeInteresDTO pdiDTO) {
        // 1. Llama al metodo (convertirADto) para crear la entidad y asignar el usuario
        PuntoDeInteres nuevoPdi = convertirADto(pdiDTO);
        // 2. Llamada directa al repositorio
        return puntoDeInteresRepository.save(nuevoPdi);

    }

    @Override
    public PuntoDeInteres convertirADto(PuntoDeInteresDTO pdiDTO) {

        // 1. Obtener el ID del usuario autenticado desde el contexto de Spring Security
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Asume que el 'principal' contiene el nombre de usuario (o la clave)
        String emailUsuario = auth.getName();

        // 2. Buscar la entidad Usuario en la base de datos
        Usuario creador = usuarioRepository.findByEmail(emailUsuario);
        // Verificar si el usuario existe (findByEmail devuelve null si no existe)
        if (creador == null) {
            throw new ResourceNotFoundException("Usuario creador no encontrado: " + emailUsuario);
        }
        // 3. Mapear los datos del DTO a la nueva Entidad
        PuntoDeInteres pdi = new PuntoDeInteres();
        pdi.setNombre(pdiDTO.getNombre());
        // El JSON se guarda en descripcion
        pdi.setDescripcion(pdiDTO.getContenidoJson());

        // 4. Asignar la relación (Clave Foránea)
        pdi.setCreador(creador);

        return pdi;
    }

}