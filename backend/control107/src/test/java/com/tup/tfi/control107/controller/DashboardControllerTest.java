package com.tup.tfi.control107.controller;

import com.tup.tfi.control107.service.TurnoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class DashboardControllerTest {

    @Autowired
    private TurnoService turnoService;

    @Autowired
    private DashboardController dashboardController;

    @Test
    void contextLoads() {
        assertThat(turnoService).isNotNull();
        assertThat(dashboardController).isNotNull();
    }

    @Test
    void testObtenerResumenOperativoService() {

    }
}
