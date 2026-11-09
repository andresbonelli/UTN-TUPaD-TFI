# Sistema de Gestión y Trazabilidad de Emergencias 107

## 📘 Trabajo Final Integrador - Entrega Final 

**Tecnicatura Universitaria en Programación - Universidad Tecnológica Nacional**

## Integrantes

- Andres Bonelli
- Matias Carro

--- 
##  Introducción

Este **Trabajo Integrador Final** consiste en el desarrollo de una aplicación web destinada a mejorar la gestión operativa del servicio de emergencias 107. El sistema digitaliza el proceso actualmente realizado mediante planillas en papel, donde se registran datos de ambulancias, personal, estado general de la unidad e insumos críticos.

El objetivo del sistema no es solo reemplazar la planilla física, sino **mejorar la trazabilidad de cada turno**, registrar de manera estructurada los **controles de ingreso y egreso**, detectar **faltantes y condiciones críticas**, calcular el **uso total de insumos** y conservar **historiales operativos completos** para el servicio 107.  
El proyecto se desarrolla aplicando principios de **calidad de software**, **diseño**, **mantenibilidad**, **SOLID**, **Clean Code**, **testing**, **refactoring** y **reducción de deuda técnica**, buscando mantener un sistema confiable, extensible y alineado con buenas prácticas de desarrollo.


---

## 🌐 Sistema desplegado

Control107 se encuentra disponible online en:

🔗 [Acceder a Control107](https://control107.vercel.app)

---

##  Alcance del Sistema

El sistema implementa:

- Gestión de **turnos** con franjas horarias predefinidas (mañana, tarde y noche).
- Ciclo de vida normal del turno: **PROGRAMADO → EN_CURSO → FINALIZADO**. Un turno **PROGRAMADO** también puede pasar a **CANCELADO** como estado alternativo.
- Registro de **control de ingreso** y **control de egreso**.
- Detección automática de **faltantes** según los puntos de control establecidos y registro del **consumo de insumos** durante el turno.
- Gestión de **categorías e insumos**, incluyendo el tratamiento diferenciado de **insumos críticos** y **oxígeno**.
- Registro de **reposiciones** realizadas durante la guardia.
- Registro de **observaciones de ingreso y egreso**.
- Consulta del **historial operativo de los turnos**.
- Consulta de **estadísticas básicas**.
- Roles de **Administrador** y **Enfermero**, con permisos diferenciados.
- Autenticación y autorización para el acceso a las funcionalidades del sistema.

> **Nota:** internamente, el sistema representa la franja horaria de la mañana como `MANIANA` para evitar caracteres especiales. En la interfaz se muestra al usuario como **Mañana**, manteniendo una presentación más clara y natural.

---

## Stack tecnológico

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- Ecosistema TanStack

### Backend

- Java 17
- Spring Boot
- Spring Data JPA
- Spring Security
- JWT

### Base de datos

- MySQL 8 en producción.
- H2 para desarrollo y pruebas.

### Despliegue

- Docker
- Docker Compose
- Caddy como proxy inverso
- GitHub Actions para el despliegue automatizado del backend

---

## 📄 Documentación y Presentación

- 📘 [Documento de Introducción (PDF)](docs/Introduccion.pdf)  
- 📊 [Presentación de la Propuesta (PDF)](docs/Propuesta.pdf)



---

## Estructura del repositorio

```text
UTN-TUPaD-TFI/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── backend/
│   └── control107/
│       ├── Caddyfile
│       ├── docker-compose.yml
│       ├── Dockerfile
│       ├── pom.xml
│       └── src/
├── database/
│   └── V1.0.0__init.sql
├── docs/
└── frontend/
    └── control107/
        ├── package.json
        ├── vite.config.ts
        └── src/
```
---

## Backend

El backend se encuentra organizado por responsabilidades:

```text
backend/control107/src/main/
├── java/com/tup/tfi/control107/
│   ├── config/
│   ├── controller/
│   ├── dto/
│   ├── exception/
│   ├── model/
│   ├── repository/
│   ├── service/
│   └── util/
└── resources/
```

Las pruebas automatizadas se encuentran en:

```text
backend/control107/src/test/
```

---

## Frontend

El frontend se encuentra organizado mediante páginas, componentes, servicios, hooks, interfaces, configuración y estado global:

```text
frontend/control107/src/
├── assets/
├── components/
├── config/
├── hooks/
├── interfaces/
├── pages/
├── services/
├── stores/
└── utils/
```

---

## Ejecución del proyecto

Para ejecutar Control107 de forma local, consulte las instrucciones específicas de cada componente:

- [Frontend](./frontend/control107/README.md)
- [Backend](./backend/control107/README.md)

La configuración del entorno requiere definir las variables correspondientes para la conexión con la base de datos, autenticación y comunicación entre frontend y backend.

---

## Documentación

La documentación técnica y académica del proyecto se encuentra en el directorio `/docs`, donde se incluyen los documentos de arquitectura, modelo de datos, requerimientos y demás material generado durante el desarrollo.


- 📄 [Documentación Previa al Proyecto (PDF)](docs/Documentacion%20Previa%20al%20proyecto.pdf)
- 🚀 [Colección de Postman (Endpoints API)](docs/collection.json)
- 🗺️ [Diagrama Entidad–Relación (DER)](docs/DER.md)
- 🏗️ [Arquitectura del Proyecto](./docs/Arquitectura.md)
- 🧩 [Listado de Módulos](./docs/Modulos.md)


---

## Estado del proyecto

Control107 se entrega como un **producto mínimo viable funcional**, desarrollado como Trabajo Integrador Final de la Tecnicatura Universitaria en Programación.
