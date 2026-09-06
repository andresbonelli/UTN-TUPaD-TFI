package com.tup.tfi.control107.model.entity;

import com.tup.tfi.control107.model.enums.EstadoAmbulancia;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ambulancias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ambulancia extends BaseEntity {

    @Column(name = "nro_movil", nullable = false, unique = true)
    private String nroMovil; // Ej: "MÓVIL 01"

    @Column(nullable = false, unique = true)
    private String patente;

    @Column(name = "codigo_qr", unique = true)
    private String codigoQR;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoAmbulancia estado;

    @Column(name = "presion_oxigeno_psi")
    private Integer presionOxigenoPsi; // Dato crítico UI (ej: 850 psi)

    @Column(name = "kilometraje_actual")
    private Double kilometrajeActual;
}
