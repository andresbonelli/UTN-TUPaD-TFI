package com.tup.tfi.control107.model.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Registro de control de insumos utilizados en un turno.
 */
@Entity
@Table(name = "control_insumos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ControlInsumo extends BaseEntity{

    @ManyToOne
    @JoinColumn(name = "turno_id")
    private Turno turno;

    @ManyToOne
    @JoinColumn(name = "insumo_id")
    private Insumo insumo;

    @Column(name = "cantidad_ingreso")
    private int cantidadIngreso;

    @Column(name = "cantidad_egreso")
    private Integer cantidadEgreso;

    @Column(name = "cantidad_restockeo")
    private int cantidadRestockeo;

    @Column(name = "ingreso_faltante")
    private int ingresoFaltante;

    @Column(name = "cantidad_usada")
    private Integer cantidadUsada;

    @Builder.Default
    @Column(name = "es_oxigeno", nullable = false)
    private boolean esOxigeno = false;

    @Column(name = "capacidad_maxima")
    private Double capacidadMaxima = null;

    public void informarIngreso(int cantidadIngreso) {
        this.cantidadIngreso = cantidadIngreso;
        this.ingresoFaltante = Math.max(0, this.insumo.getPuntoControl() - cantidadIngreso);
    }

    public void informarEgreso(int cantidadEgreso, int cantidadRestockeo) {
        this.cantidadEgreso = cantidadEgreso;
        this.cantidadRestockeo = cantidadRestockeo;
        this.cantidadUsada = Math.max(0, this.cantidadIngreso + cantidadRestockeo - cantidadEgreso);
    }
}
