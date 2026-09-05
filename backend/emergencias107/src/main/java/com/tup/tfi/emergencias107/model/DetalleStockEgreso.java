package com.tup.tfi.emergencias107.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "detalles_stock_egreso")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetalleStockEgreso extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "control_egreso_id", nullable = false)
    private ControlEgreso controlEgreso;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "insumo_id", nullable = false)
    private Insumo insumo;

    @Column(name = "cantidad_dejada", nullable = false)
    private Integer cantidadDejada;
}
