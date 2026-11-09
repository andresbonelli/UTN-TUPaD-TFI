# Control107 - Frontend

Frontend web de **Control107**, desarrollado para proporcionar la interfaz de administración y operación del sistema de gestión del servicio de emergencias 107.

## Stack tecnológico

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- TanStack Query
- TanStack Form
- TanStack Table
- React Router

## Estructura

El frontend se encuentra organizado por responsabilidades:

```text
src/
├── assets/          # Recursos estáticos
├── components/      # Componentes reutilizables
├── config/          # Configuración de la aplicación
├── hooks/           # Hooks y consultas mediante TanStack Query
├── interfaces/      # Tipos e interfaces TypeScript
├── pages/           # Vistas principales
├── services/        # Comunicación con la API
├── stores/          # Estado global
└── utils/           # Funciones auxiliares
```

## Funcionalidades principales

La interfaz permite:

- Inicio y cierre de sesión.
- Acceso diferenciado según los roles **Administrador** y **Enfermero**.
- Gestión de usuarios, ambulancias, categorías e insumos.
- Programación y consulta de turnos.
- Registro de controles de ingreso y egreso.
- Registro de reposiciones y observaciones.
- Cancelación de turnos.
- Consulta del historial operativo.
- Visualización de estadísticas operativas.
- Tratamiento visual diferenciado de insumos críticos y oxígeno.

## Gestión de datos

**TanStack Query** se utiliza para consultar y actualizar datos provenientes de la API, gestionando la invalidación de consultas después de las operaciones de modificación.

Los formularios utilizan **TanStack Form** para administrar su estado y realizar validaciones antes del envío.

Las vistas que requieren búsqueda, ordenamiento y paginación utilizan **TanStack Table**.

## Autenticación y estado global

El estado de autenticación se administra mediante **Zustand**. Después del inicio de sesión, el frontend conserva la información necesaria para identificar al usuario autenticado y controlar el acceso a las vistas correspondientes a su rol.

La comunicación con los recursos protegidos del backend utiliza el token JWT obtenido durante la autenticación.

## Turnos

La interfaz representa el ciclo normal del turno como:

**PROGRAMADO → EN_CURSO → FINALIZADO**

Un turno **PROGRAMADO** también puede pasar a **CANCELADO** como estado alternativo.

Internamente, la franja horaria de la mañana se representa como `MANIANA`, mientras que en la interfaz se muestra como **Mañana**.

## Oxígeno

Los insumos identificados como oxígeno reciben un tratamiento visual diferenciado. La interfaz utiliza su presión registrada, punto de control y capacidad máxima para representar su estado y facilitar el control durante el turno.

## Integración con el backend

La comunicación con el backend se encuentra centralizada en `src/services/`, mientras que los hooks de `src/hooks/` gestionan las consultas y mutaciones utilizadas por los componentes.

Los tipos utilizados para los datos intercambiados con la API se encuentran definidos en `src/interfaces/`.

## Ejecución

### Requisitos

El proyecto requiere Node.js y pnpm.

### Instalación

Desde el directorio:

```text
frontend/control107/
```

instale las dependencias:

```bash
pnpm install
```

### Entorno de desarrollo

Para iniciar el frontend en modo desarrollo:

```bash
pnpm dev
```

### Compilación

Para generar la versión de producción:

```bash
pnpm build
```

Este comando ejecuta la compilación de TypeScript y genera el build mediante Vite.

### Análisis estático

Para ejecutar Oxlint:

```bash
pnpm lint
```

### Vista previa del build

Para ejecutar localmente la versión compilada:

```bash
pnpm preview
```