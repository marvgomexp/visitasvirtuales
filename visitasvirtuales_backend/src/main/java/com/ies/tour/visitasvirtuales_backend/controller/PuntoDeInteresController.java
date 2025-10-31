package com.ies.tour.visitasvirtuales_backend.controller;

import com.ies.tour.visitasvirtuales_backend.model.PuntoDeInteres;
import com.ies.tour.visitasvirtuales_backend.service.PuntoDeInteresService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    // -------------------------------------------------------------
    // RUTA 1: CRUD BÁSICO (Para administración)
    // -------------------------------------------------------------

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

    // POST /api/pdis
    @PostMapping
    public ResponseEntity<PuntoDeInteres> crearPdi(@RequestBody PuntoDeInteres pdi) {
        PuntoDeInteres nuevoPdi = puntoDeInteresService.save(pdi);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPdi);
    }

    // -------------------------------------------------------------
    // RUTA 2: RUTA RELACIONAL (Obtener PDIs de una visita específica)
    // -------------------------------------------------------------

    // GET /api/pdis/visita/{idVisita}
    @GetMapping("/visita/{idVisita}")
    public ResponseEntity<List<PuntoDeInteres>> listarPorVisita(@PathVariable Integer idVisita) {
        List<PuntoDeInteres> pdis = puntoDeInteresService.findByVisitaId(idVisita);
        return ResponseEntity.ok(pdis);
    }

    // DELETE /api/pdis/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPdi(@PathVariable Integer id) {
        if (puntoDeInteresService.findById(id).isPresent()) {
            puntoDeInteresService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
