# Control107 - Estado actual del frontend

## Implementado hasta el momento

- Flujo operativo del enfermero:
  - Visualización del turno asignado.
  - Control de ingreso de insumos.
  - Registro de faltantes.
  - Control diferenciado de insumos críticos.
  - Control especial de oxígeno mediante presión en bares.
  - Card de oxígeno con nivel, porcentaje y estados `LLENO`, `OPERATIVO` y `CAMBIAR`.
  - Control de egreso.
  - Registro de restockeo.
  - Finalización de turnos.
  - Cancelación de turnos programados con observación.
  - Categorías identificadas mediante colores configurados en backend.

- Autenticación:
  - Login mediante JWT.
  - Decodificación del JWT con `jwt-decode`.
  - Obtención de `id`, `email` y `rol` desde el token.
  - Estado global de autenticación mediante Zustand.
  - Persistencia del token mediante `sessionStorage`.
  - Restauración automática de sesión después de recargar la pagina.
  - Validación de expiración del JWT.
  - Logout.
  - Roles `ADMINISTRADOR` y `ENFERMERO`.
  - Rutas protegidas según rol.
  - Redirección de rutas inexistentes.
  - El operativo utiliza el ID obtenido del usuario autenticado.

- Axios:
  - Instancia central de Axios.
  - `baseURL` centralizada.
  - Interceptor de request.
  - Envío automático de `Authorization: Bearer <JWT>`.
  - Interceptor de response preparado para errores `401`.
  - Diferenciación entre `401` del login y `401` de una sesión inválida.
  - `listarTurnosPorEnfermero()` migrado a Axios como prueba de integración.

- Panel administrativo:
  - Ruta principal `/admin`.
  - `AdminLayout` reutilizable.
  - Header con usuario autenticado y logout.
  - Navegación lateral.
  - Rutas administrativas anidadas mediante React Router y `Outlet`.
  - Dashboard administrativo.
  - Gestión de categorías disponible en `/admin/categorias`.
  - Dashboard preparado para futuras páginas de insumos, ambulancias, usuarios y turnos.

## Tecnologías utilizadas

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- TanStack Form
- Zustand
- Axios
- jwt-decode
