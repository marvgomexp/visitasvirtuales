package com.ies.tour.visitasvirtuales_backend.service;

import com.ies.tour.visitasvirtuales_backend.model.PuntoDeInteres;
import com.ies.tour.visitasvirtuales_backend.repository.PuntoDeInteresRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PuntoDeInteresServiceImpl implements PuntoDeInteresService {

    private final PuntoDeInteresRepository puntoDeInteresRepository;

    @Autowired
    public PuntoDeInteresServiceImpl(PuntoDeInteresRepository puntoDeInteresRepository) {
        this.puntoDeInteresRepository = puntoDeInteresRepository;
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
    @Transactional(readOnly = true)
    public List<PuntoDeInteres> findByVisitaId(Integer idVisitas) {
        return puntoDeInteresRepository.findByVisitaVirtual_IdVisitas(idVisitas);
    }

    @Override
    @Transactional
    public PuntoDeInteres save(PuntoDeInteres pdi) {
        return puntoDeInteresRepository.save(pdi);
    }

    @Override
    @Transactional
    public void deleteById(Integer id) {
        puntoDeInteresRepository.deleteById(id);
    }
}