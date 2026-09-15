package com.tup.tfi.control107.controller;

import com.tup.tfi.control107.service.TurnoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class TurnoControllerTest {

    @Autowired
    private TurnoService turnoService;

    @Autowired
    private TurnoController turnoController;

    @Test
    void contextLoads() {
        assertThat(turnoService).isNotNull();
        assertThat(turnoController).isNotNull();
    }

    @Test
    void testObtenerResumenOperativoService() {

    }
}
