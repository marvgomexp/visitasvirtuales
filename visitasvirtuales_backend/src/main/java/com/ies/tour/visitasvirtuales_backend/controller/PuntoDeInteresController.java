package com.ies.tour.visitasvirtuales_backend.controller;

import com.ies.tour.visitasvirtuales_backend.dto.PuntoDeInteresDTO;
import com.ies.tour.visitasvirtuales_backend.model.PuntoDeInteres;
import com.ies.tour.visitasvirtuales_backend.service.PuntoDeInteresService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pdis")
public class PuntoDeInteresController {

    private final PuntoDeInteresService puntoDeInteresService;

    @Autowired
    public PuntoDeInteresController(PuntoDeInteresService puntoDeInteresService) {
        this.puntoDeInteresService = puntoDeInteresService;
    }

    // RUTA 1: CRUD BÁSICO (Para administración)

    // GET /api/pdis
    @GetMapping
    public ResponseEntity<List<PuntoDeInteres>> listarTodos() {
        List<PuntoDeInteres> pdis = puntoDeInteresService.findAll();
        return ResponseEntity.ok(pdis);
    }

    // GET /api/pdis/{id}
    @GetMapping("/{id}")
    public ResponseEntity<PuntoDeInteres> listarPorId(@PathVariable Integer id) {
        return puntoDeInteresService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // RUTA 2: RUTA RELACIONAL (Obtener PDIs de una visita específica)

    /*
     * // GET /api/pdis/visita/{idVisita}
     * 
     * @GetMapping("/visita/{idVisita}")
     * public ResponseEntity<List<PuntoDeInteres>> listarPorVisita(@PathVariable
     * Integer idVisita) {
     * List<PuntoDeInteres> pdis = puntoDeInteresService.findByVisitaId(idVisita);
     * return ResponseEntity.ok(pdis);
     * }
     */

    // DELETE /api/pdis/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPdi(@PathVariable Integer id) {
        if (puntoDeInteresService.findById(id).isPresent()) {
            puntoDeInteresService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // AÑADIR INFORMACION PDI
    @PostMapping("/infoPdi")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('PROFESOR')")
    public ResponseEntity<PuntoDeInteres> crearPuntoDeInteres(
            @Valid @RequestBody PuntoDeInteresDTO pdiDTO) {
        // 1. El servicio obtiene el usuario, mapea el DTO y guarda la entidad en la DB
        PuntoDeInteres pdiGuardado = puntoDeInteresService.saveFromDto(pdiDTO);
        // 2. Devuelve la respuesta 201 Created
        return new ResponseEntity<>(pdiGuardado, HttpStatus.CREATED);
    }
}
