package com.tup.tfi.emergencias107.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "detalles_stock_ingreso")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetalleStockIngreso extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "control_ingreso_id", nullable = false)
    private ControlIngreso controlIngreso;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "insumo_id", nullable = false)
    private Insumo insumo;

    @Column(name = "cantidad_recibida", nullable = false)
    private Integer cantidadRecibida;

    @Column(name = "faltante_calculado", nullable = false)
    private Integer faltanteCalculado;
}
