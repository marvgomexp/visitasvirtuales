package com.ies.tour.visitasvirtuales_backend.repository;

import com.ies.tour.visitasvirtuales_backend.model.PuntoDeInteres;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PuntoDeInteresRepository extends JpaRepository<PuntoDeInteres, Integer> {

    // Método para obtener todos los puntos de interes de una visita
    List<PuntoDeInteres> findByVisitaVirtual_IdVisitas(Integer idVisitas);

}
