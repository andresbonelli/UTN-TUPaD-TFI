# Arquitectura del Proyecto - Sistema de Gestión 107

## 1. Modelo Arquitectónico
El proyecto utiliza una **arquitectura en capas**, siguiendo los principios de separación de responsabilidades, mantenibilidad y SOLID.

### Backend (Java + Spring Boot)
El backend implementa una **API REST** con las siguientes capas:

- **Controller**: expone endpoints REST y recibe las solicitudes del frontend.  
- **Service**: contiene la lógica de negocio, validaciones y reglas operativas.  
- **Repository**: acceso a datos mediante Spring Data JPA.  
- **Entities / DTOs**: modelo de dominio y objetos de transferencia.  

Esta arquitectura permite:
- desacoplar lógica de negocio del acceso a datos,  
- facilitar testing,  
- mantener coherencia con prácticas profesionales,  
- escalar el sistema sin modificar capas superiores.

### Frontend (React + Vite + TypeScript)
El frontend es una **Single Page Application (SPA)** que consume la API REST del backend.

Estructura:
- **components/**: UI reutilizable  
- **pages/**:  vistas completas  
- **services/**: llamadas HTTP al backend  
- **hooks/**: lógica reutilizable  
- **assets/**:  recursos estáticos  

Se utiliza **TypeScript** para mejorar robustez, autocompletado y detección temprana de errores.

### Base de Datos (MySQL)
Se utiliza un modelo **relacional**, con integridad referencial, claves primarias, foráneas y restricciones.

- el dominio requiere trazabilidad estricta,  
- integridad fuerte entre entidades (turnos, insumos, ambulancias),  
- facilidad para auditoría y consultas estadísticas.

Nota: Se utiliza H2 solamente en entorno de desarrollo y para pruebas, en produccion se utilizara MySQL

## 2. Justificación del Stack Tecnológico

### Spring Boot
- soporte nativo para REST  
- integración con JPA/Hibernate  
- manejo de seguridad y roles  
- arquitectura en capas natural  
- estándar industrial

### React + Vite + TypeScript
- rendimiento alto (Vite)  
- tipado fuerte (TS)  
- componentes reutilizables  
- curva de aprendizaje adecuada para el equipo  
- excelente soporte para SPA

### MySQL
- robustez  
- integridad  
- facilidad de despliegue  
- soporte para restricciones y auditoría

## 3. Comunicación entre Componentes
El frontend se comunica con el backend mediante:
- **HTTP/JSON**  
- Endpoints REST documentados  
- Autenticación mediante hash + salt  

## 4. Decisiones Técnicas
- Se eligió **monolito modular** en lugar de microservicios por simplicidad y alcance del MVP.  
- Se descartó arquitectura documental (MongoDB) por necesidad de integridad relacional.  
- Se descartó equipo variable complejo para evitar sobrecarga en el modelo.  
