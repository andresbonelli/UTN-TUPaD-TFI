# Control107 - Backend

Backend de **Control107**, desarrollado para gestionar la lógica de negocio, persistencia, seguridad y API REST del sistema de gestión operativa del servicio de emergencias 107.

## Stack tecnológico

- Java 17
- Spring Boot 4.1.1
- Spring Data JPA
- Spring Security
- JWT
- MySQL 8
- H2 para pruebas
- Maven
- Docker / Docker Compose
- Caddy

## Estructura

El backend se organiza por responsabilidades:

```text
src/main/java/com/tup/tfi/control107/
├── config/         # Seguridad, CORS, OpenAPI y configuración general
├── controller/     # Endpoints REST
├── dto/            # Objetos de entrada y salida
├── exception/      # Excepciones
├── model/          # Entidades y enumeraciones del dominio
├── repository/     # Acceso a datos mediante JPA
├── service/        # Contratos de servicios
└── util/           # Utilidades de seguridad y autenticación
```

La implementación de la lógica de negocio se encuentra dentro de `service/impl`.

## Funcionalidades principales

La API gestiona:

- Usuarios y roles.
- Ambulancias.
- Categorías e insumos.
- Turnos y su ciclo operativo.
- Controles de ingreso y egreso.
- Faltantes, reposiciones y consumo de insumos.
- Tratamiento diferenciado de insumos críticos y oxígeno.
- Autenticación mediante JWT y autorización según el rol.

El ciclo normal de un turno es:

**PROGRAMADO → EN_CURSO → FINALIZADO**

Un turno **PROGRAMADO** también puede pasar a **CANCELADO** como estado alternativo.

## Persistencia y baja lógica

Las entidades principales utilizan el campo `eliminado` para implementar **baja lógica**, conservando los registros en la base de datos y excluyéndolos de las consultas operativas correspondientes.

> **Nota:** las relaciones `enfermero_id` y `admin_id` permiten `NULL` a nivel de persistencia como parte del manejo de las relaciones y bajas lógicas en la base de datos. Esto no implica que un turno pueda operar sin el personal requerido: la asignación obligatoria del administrador y del enfermero se valida mediante la lógica de negocio del backend.

## Seguridad

La API utiliza **Spring Security** y autenticación mediante **JWT**. Los permisos se diferencian entre los roles `ADMINISTRADOR` y `ENFERMERO`, incluyendo controles específicos para las operaciones realizadas por el enfermero asignado a cada turno.

## Base de datos

- **Producción:** MySQL 8.
- **Pruebas:** H2 con compatibilidad MySQL.

El esquema SQL de referencia se encuentra en:

```text
/database/V1.0.0__init.sql
```

## Pruebas

El backend incluye pruebas automatizadas para controladores y servicios utilizando **JUnit, Mockito y MockMvc**.

Las pruebas se encuentran en:

```text
src/test/
```

## Ejecución

### Mediante Docker Compose

El backend está preparado para ejecutarse junto con MySQL y Caddy mediante Docker Compose.

Antes de iniciar los servicios se deben definir las siguientes variables de entorno:

```env
DB_ROOT_PASSWORD=
DB_USERNAME=
DB_PASSWORD=
JWT_SECRET_KEY=
FRONTEND_HOST=http://localhost:5173
```

Luego, desde:

```text
backend/control107/
```

ejecute:

```bash
docker compose up -d --build
```

Docker Compose inicia los servicios:

- MySQL 8
- API de Control107
- Caddy

Para consultar el estado de los contenedores:

```bash
docker compose ps
```

Para consultar los logs:

```bash
docker compose logs -f api
docker compose logs -f db
docker compose logs -f caddy
```

Para detener los servicios:

```bash
docker compose down
```

Los datos de MySQL se almacenan en el volumen persistente `control107_db_data`, por lo que `docker compose down` no elimina la información almacenada.

### Compilación y pruebas

Para compilar el backend:

```bash
mvn clean package
```

Para ejecutar las pruebas automatizadas:

```bash
mvn test
```