-- ============================================================================
-- Esquema de base de datos (MySQL 8 / InnoDB)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- usuarios
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    eliminado   BOOLEAN      NOT NULL DEFAULT FALSE,
    nombre      VARCHAR(255) NOT NULL,
    dni         VARCHAR(20)  NOT NULL,
    email       VARCHAR(150) NOT NULL,
    rol         VARCHAR(20)  NOT NULL,
    activo      BOOLEAN      NOT NULL DEFAULT TRUE,
    hash        VARCHAR(255) NULL,
    salt        VARCHAR(255) NULL,

    CONSTRAINT pk_usuarios PRIMARY KEY (id),
    CONSTRAINT uk_usuarios_dni UNIQUE (dni),
    CONSTRAINT uk_usuarios_email UNIQUE (email),
    INDEX idx_usuarios_rol_activo (rol, activo, eliminado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- ambulancias
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ambulancias (
    id          BIGINT      NOT NULL AUTO_INCREMENT,
    created_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    eliminado   BOOLEAN     NOT NULL DEFAULT FALSE,
    patente     VARCHAR(20) NOT NULL,
    disponible  BOOLEAN     NOT NULL DEFAULT TRUE,

    CONSTRAINT pk_ambulancias PRIMARY KEY (id),
    CONSTRAINT uk_ambulancias_patente UNIQUE (patente),   -- índice único sobre patente
    INDEX idx_ambulancias_disponible (disponible, eliminado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- categorias
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    eliminado   BOOLEAN      NOT NULL DEFAULT FALSE,
    nombre      VARCHAR(100) NOT NULL,
    color       VARCHAR(7)   NOT NULL,   -- hexadecimal, ej: #FF0000

    CONSTRAINT pk_categorias PRIMARY KEY (id),
    CONSTRAINT uk_categorias_nombre UNIQUE (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- insumos
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS insumos (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    eliminado     BOOLEAN      NOT NULL DEFAULT FALSE,
    nombre        VARCHAR(255) NOT NULL,
    punto_control INT          NOT NULL,
    critico       BOOLEAN      NOT NULL DEFAULT FALSE,
    categoria_id  BIGINT       NOT NULL,

    CONSTRAINT pk_insumos PRIMARY KEY (id),
    INDEX idx_insumos_categoria (categoria_id),
    INDEX idx_insumos_nombre (nombre),
    INDEX idx_insumos_critico (critico),
    CONSTRAINT fk_insumos_categoria FOREIGN KEY (categoria_id)
        REFERENCES categorias (id) ON DELETE RESTRICT,
    CONSTRAINT ck_insumos_punto_control CHECK (punto_control >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- ambulancia_insumo (tabla intermedia N:M)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ambulancia_insumo (
    ambulancia_id BIGINT NOT NULL,
    insumo_id     BIGINT NOT NULL,

    CONSTRAINT pk_ambulancia_insumo PRIMARY KEY (ambulancia_id, insumo_id),
    INDEX idx_ai_insumo (insumo_id),
    CONSTRAINT fk_ai_ambulancia FOREIGN KEY (ambulancia_id)
        REFERENCES ambulancias (id) ON DELETE RESTRICT,
    CONSTRAINT fk_ai_insumo FOREIGN KEY (insumo_id)
        REFERENCES insumos (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- turnos
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS turnos (
    id                    BIGINT       NOT NULL AUTO_INCREMENT,
    created_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    eliminado             BOOLEAN      NOT NULL DEFAULT FALSE,
    fecha                 DATE         NOT NULL,
    horario               VARCHAR(20)  NOT NULL,
    estado                VARCHAR(20)  NOT NULL,
    nombre_chofer         VARCHAR(100) NOT NULL,
    nombre_medico         VARCHAR(100) NOT NULL,
    observaciones_ingreso TEXT         NULL,
    observaciones_egreso  TEXT         NULL,
    ambulancia_id         BIGINT       NOT NULL,
    enfermero_id          BIGINT       NULL,
    admin_id              BIGINT       NULL,

    CONSTRAINT pk_turnos PRIMARY KEY (id),
    INDEX idx_turnos_ambulancia_fecha (ambulancia_id, fecha, horario),
    INDEX idx_turnos_enfermero_fecha (enfermero_id, fecha),
    INDEX idx_turnos_admin (admin_id),
    INDEX idx_turnos_fecha_estado (fecha, estado),
    CONSTRAINT fk_turnos_ambulancia FOREIGN KEY (ambulancia_id)
        REFERENCES ambulancias (id) ON DELETE RESTRICT,
    CONSTRAINT fk_turnos_enfermero FOREIGN KEY (enfermero_id)
        REFERENCES usuarios (id) ON DELETE RESTRICT,
    CONSTRAINT fk_turnos_admin FOREIGN KEY (admin_id)
        REFERENCES usuarios (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- control_insumos
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS control_insumos (
    id                 BIGINT   NOT NULL AUTO_INCREMENT,
    created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    eliminado          BOOLEAN  NOT NULL DEFAULT FALSE,
    cantidad_ingreso   INT      NULL,
    cantidad_restockeo INT      NULL,
    cantidad_egreso    INT      NULL,
    ingreso_faltante   INT      NULL,
    cantidad_usada     INT      NULL,
    turno_id           BIGINT   NOT NULL,
    insumo_id          BIGINT   NOT NULL,

    CONSTRAINT pk_control_insumos PRIMARY KEY (id),
    CONSTRAINT uk_control_turno_insumo UNIQUE (turno_id, insumo_id),
    INDEX idx_control_insumo (insumo_id),
    CONSTRAINT fk_control_turno FOREIGN KEY (turno_id)
        REFERENCES turnos (id) ON DELETE RESTRICT,
    CONSTRAINT fk_control_insumo FOREIGN KEY (insumo_id)
        REFERENCES insumos (id) ON DELETE RESTRICT,
    CONSTRAINT ck_control_cantidades CHECK (
        (cantidad_ingreso   IS NULL OR cantidad_ingreso   >= 0) AND
        (cantidad_restockeo IS NULL OR cantidad_restockeo >= 0) AND
        (cantidad_egreso    IS NULL OR cantidad_egreso    >= 0) AND
        (ingreso_faltante   IS NULL OR ingreso_faltante   >= 0) AND
        (cantidad_usada     IS NULL OR cantidad_usada     >= 0)
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;