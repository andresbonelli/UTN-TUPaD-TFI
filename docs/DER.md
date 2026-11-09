```mermaid
erDiagram

    usuarios {
        bigint id PK
        datetime created_at "NOT NULL"
        datetime updated_at "NOT NULL"
        boolean eliminado "NOT NULL"
        varchar(255) nombre "NOT NULL"
        varchar(20) dni "NOT NULL"
        varchar(150) email "NOT NULL"
        varchar(20) rol "NOT NULL"
        boolean activo "NOT NULL"
        varchar(255) hash "NULL"
        varchar(255) salt "NULL"
    }

    ambulancias {
        bigint id PK
        datetime created_at "NOT NULL"
        datetime updated_at "NOT NULL"
        boolean eliminado "NOT NULL"
        varchar(20) patente "NOT NULL"
        boolean disponible "NOT NULL"
    }

    categorias {
        bigint id PK
        datetime created_at "NOT NULL"
        datetime updated_at "NOT NULL"
        boolean eliminado "NOT NULL"
        varchar(100) nombre "NOT NULL"
        varchar(7) color "NOT NULL"
    }

    insumos {
        bigint id PK
        datetime created_at "NOT NULL"
        datetime updated_at "NOT NULL"
        boolean eliminado "NOT NULL"
        varchar(255) nombre "NOT NULL"
        int punto_control "NOT NULL"
        boolean critico "NOT NULL"
        boolean oxigeno "NOT NULL"
        double capacidad_maxima "NULL - solo oxigeno"
        bigint categoria_id FK "NOT NULL"
    }

    ambulancia_insumo {
        bigint ambulancia_id PK, FK
        bigint insumo_id PK, FK
    }

    turnos {
        bigint id PK
        datetime created_at "NOT NULL"
        datetime updated_at "NOT NULL"
        boolean eliminado "NOT NULL"
        date fecha "NOT NULL"
        varchar(20) horario "NOT NULL"
        varchar(20) estado "NOT NULL"
        varchar(100) nombre_chofer "NOT NULL"
        varchar(100) nombre_medico "NOT NULL"
        text observaciones_ingreso "NULL"
        text observaciones_egreso "NULL"
        bigint ambulancia_id FK "NOT NULL"
        bigint enfermero_id FK "NULL"
        bigint admin_id FK "NULL"
    }

    control_insumos {
        bigint id PK
        datetime created_at "NOT NULL"
        datetime updated_at "NOT NULL"
        boolean eliminado "NOT NULL"
        int cantidad_ingreso "NULL"
        int cantidad_restockeo "NULL"
        int cantidad_egreso "NULL"
        int ingreso_faltante "NULL"
        int cantidad_usada "NULL"
        boolean es_oxigeno "NOT NULL"
        double capacidad_maxima "NULL - solo oxigeno"
        bigint turno_id FK "NOT NULL"
        bigint insumo_id FK "NOT NULL"
    }

    categorias ||--o{ insumos : "clasifica"

    ambulancias ||--o{ ambulancia_insumo : "asocia"
    insumos ||--o{ ambulancia_insumo : "asocia"

    ambulancias ||--o{ turnos : "es utilizada en"

    usuarios o|--o{ turnos : "administra"
    usuarios o|--o{ turnos : "atiende"

    turnos ||--o{ control_insumos : "registra"
    insumos ||--o{ control_insumos : "es controlado en"
```

> **Nota sobre la asignación de personal:** los campos `enfermero_id` y `admin_id` admiten valores nulos a nivel de persistencia para permitir el manejo de bajas lógicas sin eliminar físicamente los registros relacionados. La obligatoriedad de asignar el personal correspondiente a cada turno se controla mediante las reglas de negocio implementadas en el backend. Por este motivo, la posibilidad de almacenar `NULL` en estas relaciones no implica que la aplicación permita operar libremente un turno sin el personal requerido.