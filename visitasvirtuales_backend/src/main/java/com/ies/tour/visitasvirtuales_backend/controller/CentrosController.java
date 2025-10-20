package com.ies.tour.visitasvirtuales_backend.controller;

import com.ies.tour.visitasvirtuales_backend.model.Centros;
import com.ies.tour.visitasvirtuales_backend.service.CentroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/centros")
public class CentrosController {

    private final CentroService centroService;

    @Autowired
    public CentrosController(CentroService centroService) {
        this.centroService = centroService;
    }

    // GET /api/centros
    @GetMapping
    public ResponseEntity<List<Centros>> listarTodos() {
        List<Centros> centros = centroService.findAll();
        return ResponseEntity.ok(centros);
    }

    // GET /api/centros/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Centros> listarPorId(@PathVariable Integer id) {
        return centroService.findById(id)
                .map(ResponseEntity::ok) // Si lo encuentra, devuelve 200 OK
                .orElseGet(() -> ResponseEntity.notFound().build()); // Si no lo encuentra, devuelve 404 Not Found
    }

    // POST /api/centros
    // Esta ruta solo debería ser accesible para usuarios con rol
    // ADMIN
    @PostMapping
    // @PreAuthorize("hasRole('ADMIN')") // Descomentar para aplicar seguridad
    // basada en roles
    public ResponseEntity<Centros> crearCentro(@RequestBody Centros centro) {
        Centros nuevoCentro = centroService.save(centro);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoCentro); // Devuelve 201 Created
    }

    // DELETE /api/centros/{id}
    @DeleteMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')") // Descomentar para aplicar seguridad
    // basada en roles
    public ResponseEntity<Void> eliminarCentro(@PathVariable Integer id) {
        if (centroService.findById(id).isPresent()) {
            centroService.deleteById(id);
            return ResponseEntity.noContent().build(); // Devuelve 204 No Content
        }
        return ResponseEntity.notFound().build(); // Devuelve 404 Not Found
    }
}