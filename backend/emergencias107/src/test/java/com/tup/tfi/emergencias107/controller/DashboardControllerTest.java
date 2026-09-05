package com.tup.tfi.emergencias107.controller;

import com.tup.tfi.emergencias107.dto.ResumenOperativoDTO;
import com.tup.tfi.emergencias107.service.ControlGuardiaService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class DashboardControllerTest {

    @Autowired
    private ControlGuardiaService controlGuardiaService;

    @Autowired
    private DashboardController dashboardController;

    @Test
    void contextLoads() {
        assertThat(controlGuardiaService).isNotNull();
        assertThat(dashboardController).isNotNull();
    }

    @Test
    void testObtenerResumenOperativoService() {
        ResumenOperativoDTO resumen = controlGuardiaService.obtenerResumenOperativo();
        assertThat(resumen).isNotNull();
        assertThat(resumen.getAmbulanciasDisponibles()).isNotEmpty();
        assertThat(resumen.getListaAmbulancias()).hasSizeGreaterThanOrEqualTo(4);
        assertThat(resumen.getListaAmbulancias().get(0).getNroMovil()).isNotNull();
        assertThat(resumen.getAlertasPrioritarias()).isNotEmpty();
        assertThat(resumen.getAlertasPrioritarias().get(0).getInsumoNombre()).isNotNull();
    }
}
