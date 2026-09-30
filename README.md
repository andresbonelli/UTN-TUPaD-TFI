# Sistema de Gestión y Trazabilidad de Emergencias 107
### Trabajo Integrador Final (TFI) - UTN

## Integrantes

- Andres Bonelli
- Matias Carro

--- 
##  Introducción

Este **Trabajo Integrador Final** consiste en el desarrollo de una aplicación web destinada a mejorar la gestión operativa del servicio de emergencias 107. El sistema digitaliza el proceso actualmente realizado mediante planillas en papel, donde se registran datos de ambulancias, personal, estado general de la unidad e insumos críticos.

El objetivo del sistema no es solo reemplazar la planilla física, sino **mejorar la trazabilidad de cada turno**, registrar de manera estructurada los **controles de ingreso y egreso**, detectar **faltantes y condiciones críticas**, calcular el **uso total de insumos** y conservar **historiales operativos completos** para el servicio 107.  
El proyecto se desarrolla aplicando principios de **calidad de software**, **diseño**, **mantenibilidad**, **SOLID**, **Clean Code**, **testing**, **refactoring** y **reducción de deuda técnica**, garantizando un sistema confiable, extensible y alineado con buenas prácticas de desarrollo.


---

##  Alcance del Sistema

El sistema implementa:

- Gestión de **turnos** con franjas horarias predefinidas (mañana, tarde, noche).  
- Ciclo de vida del turno: **PROGRAMADO → EN_CURSO → FINALIZADO → CANCELADO**.  
- Registro de **control de ingreso** y **control de egreso**.  
- Cálculo automático de **faltantes**, **uso total** y **diferencias entre turnos**.  
- Gestión de **insumos críticos** (incluyendo oxígeno para traslados).  
- Trazabilidad completa entre guardias.  
- Roles y seguridad: **administrador** y **enfermero**, con permisos diferenciados.  
- Protección de datos y auditoría de eventos relevantes.

---

##  Stack Tecnológico

### **Frontend**
- React  
- Vite  
- TypeScript  
- Tailwind 

### **Backend**
- Java  
- Spring Boot

### **Base de Datos**
- SQL relacional (MySQL)
  
  Nota: H2 solo se usa en entorno de desarrollo y pruebas, en produccion se utilizara MySQL

---

## 📄 Documentación y Presentación

- 📘 [Documento de Introducción (PDF)](docs/Introduccion.pdf)  
- 📊 [Presentación de la Propuesta (PDF)](docs/Propuesta.pdf)



# 📘 Trabajo Final Integrador – Segunda Entrega  

---

## 📌 Alcance del MVP

El sistema implementa:

- Gestión de **usuarios** (Administrador y Enfermero).  
- Gestión de **ambulancias**.  
- Gestión de **insumos y categorías**, incluyendo insumos críticos como oxígeno.  
- **Programación de turnos** con franjas horarias fijas (mañana, tarde, noche).  
- **Control de ingreso** y detección de faltantes.  
- **Control de egreso** y cálculo de uso total.  
- **Cancelación de turno** por condiciones críticas.  
- Registro de **observaciones**.  
- **Historial operativo** por ambulancia y usuario.  

Todo el comportamiento está definido en el documento de requerimientos dentro de `/docs`.

---

## 🗂️ Estructura del Repositorio

### Frontend
```
/control107
│
├── src
│   │
│   ├── components        → Componentes reutilizables (Navbar, Card, etc.)
│   │
│   ├── pages             → Páginas completas del frontend (Home, Turnos, Login)
│   │
│   ├── services          → Funciones para llamar al backend (fetch/axios)
│   │
│   ├── hooks             → Hooks personalizados 
│   │
│   └── assets            → Imágenes, íconos, estilos globales
│
├── public                → Archivos estáticos servidos por Vite
│
├── package.json          → Placeholder (estructura del proyecto, sin dependencias)
└── vite.config.js        → Placeholder (configuración inicial de Vite)

```

---


## Documentacion

- 📄 [Documentación Previa al Proyecto (PDF)](docs/Documentacion%20Previa%20al%20proyecto.pdf)
- 🗺️ [Diagrama Entidad–Relación (DER)](docs/DER.md)
- 🏗️ [Arquitectura del Proyecto](./docs/arquitectura.md)
- 🧩 [Listado de Módulos](./docs/modulos.md)

Esta entrega incluye:

- Documentación completa de requerimientos funcionales y no funcionales.  
- Reglas de negocio, ciclo de vida del turno y franjas horarias.  
- Historias de usuario.  
- Diseño de base de datos relacional.  
- Estructura inicial del proyecto (frontend/backend).    
- Archivos técnicos, DER y PDFs dentro de `/docs`.  


---


