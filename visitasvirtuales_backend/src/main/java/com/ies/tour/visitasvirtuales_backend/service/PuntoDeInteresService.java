package com.ies.tour.visitasvirtuales_backend.service;

import com.ies.tour.visitasvirtuales_backend.model.PuntoDeInteres;
import java.util.List;
import java.util.Optional;

public interface PuntoDeInteresService {

    // Obtener todos los PDIs
    List<PuntoDeInteres> findAll();

    // Obtener un PDI por ID
    Optional<PuntoDeInteres> findById(Integer id);

    // Obtener PDIs por el ID de la VisitaVirtual
    List<PuntoDeInteres> findByVisitaId(Integer idVisitas);

    // Guardar o actualizar un PDI
    PuntoDeInteres save(PuntoDeInteres pdi);

    // Eliminar un PDI por ID
    void deleteById(Integer id);
}