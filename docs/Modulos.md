# Listado de Módulos del Sistema – MVP TFI 107

Este documento enumera los módulos funcionales incluidos en el MVP del Sistema de Gestión 107.  
Cada módulo se corresponde directamente con las pantallas y responsabilidades reales del sistema.

---

## 1. Módulo de Autenticación (Login)
**Descripción:**  
Permite el ingreso al sistema mediante usuario y contraseña.  
Determina el rol del usuario (Administrador o Enfermero) y redirige a la interfaz correspondiente.

**Prioridad:** Alta

---

## 2. Módulo Operativo del Enfermero
**Descripción:**  
Pantalla única donde el enfermero realiza todas las acciones del turno:
- Iniciar turno  
- Registrar control de ingreso  
- Declarar reposiciones  
- Registrar control de egreso  
- Cancelar turno por condiciones críticas  
- Registrar observaciones  

Este módulo concentra todo el flujo operativo en una sola página para minimizar la carga de trabajo.

**Prioridad:** Alta

---

## 3. Módulo Administrativo
**Descripción:**  
Conjunto de pantallas destinadas al administrador. Incluye:

### ABM (Altas, Bajas y Modificaciones)
- Gestión de usuarios  
- Gestión de ambulancias  
- Gestión de insumos  
- Gestión de categorías  

### Gestión Operativa
- Gestión de turnos (programación, asignación y supervisión)  
- Consulta de historial operativo  

### Visualización
- Dashboard y estadísticas básicas  

Es el módulo encargado del ABM general del sistema y de la supervisión operativa.

**Prioridad:** Alta

---
