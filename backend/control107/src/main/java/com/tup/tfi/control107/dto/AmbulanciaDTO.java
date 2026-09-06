package com.tup.tfi.control107.dto;

import com.tup.tfi.control107.model.entity.Ambulancia;
import com.tup.tfi.control107.model.enums.EstadoAmbulancia;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
public class AmbulanciaDTO {
    private Long id;
    private String nroMovil;
    private String patente;
    private String codigoQR;
    private EstadoAmbulancia estado;
    private Integer presionOxigenoPsi;
    private Double kilometrajeActual;

    public AmbulanciaDTO(Ambulancia a) {
        if (null == a) return;
        this.id = a.getId();
        this.nroMovil = a.getNroMovil();
        this.patente = a.getPatente();
        this.codigoQR = a.getCodigoQR();
        this.estado = a.getEstado();
        this.presionOxigenoPsi = a.getPresionOxigenoPsi();
        this.kilometrajeActual = a.getKilometrajeActual();
    }
}
