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

    @Column(name = "ingreso_faltante")
    private int ingresoFaltante;

    @Column(name = "cantidad_usada")
    private Integer cantidadUsada;

    public void informarIngreso(int cantidadIngreso) {
        this.cantidadIngreso = cantidadIngreso;
        this.ingresoFaltante = Math.max(0, this.insumo.getPuntoControl() - cantidadIngreso);
    }

    public void informarEgreso(int cantidadEgreso) {
        this.cantidadEgreso = cantidadEgreso;
        this.cantidadUsada = this.cantidadIngreso - this.cantidadEgreso;
    }
}
