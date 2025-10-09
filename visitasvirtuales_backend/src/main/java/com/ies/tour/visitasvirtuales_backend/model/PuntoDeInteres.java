package com.ies.tour.visitasvirtuales_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "PuntosDeInteres")
public class PuntoDeInteres {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pdi")
    private Integer idPdi;

    // Relación Muchos a Uno (N:1) -> Muchas Puntos de interes pertenecen a una
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_visitas", nullable = false) // Mapea la FK "id_visitas"
    private VisitaVirtual visitaVirtual;

    @Column(name = "nombre", nullable = false, length = 150)
    private String nombre;

    @Lob // Para campos TEXT en MySQL
    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "posicion", length = 50)
    private String posicion;
}
