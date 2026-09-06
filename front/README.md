# 107 Control

Frontend del sistema de gestión operativa para el servicio de emergencias 107.

## Base técnica

- React + TypeScript + Vite
- React Router para rutas públicas y protegidas
- TanStack Query para consultas y estados remotos
- React Hook Form + Zod para formularios y validación
- Lucide React para iconos
- CSS Modules y variables CSS para estilos encapsulados
- Oxlint para linting

Las dependencias fueron tomadas del informe de arquitectura frontend. No se incorporó Tailwind porque el informe lo deja como opcional y la primera etapa usa CSS Modules, tal como recomienda el árbol acordado.

## Estructura inicial

La aplicación separa providers globales (`src/app`), componentes reutilizables (`src/components`), servicios HTTP (`src/services`), contratos (`src/types`) y tokens globales (`src/styles`). Las features y rutas se agregan en sus carpetas propias cuando exista código funcional que las justifique.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run lint
```

La API se configura mediante `VITE_API_URL`; consultar `.env.example`.

## Prioridad responsive

La experiencia se diseña según el contexto de cada rol:

- **Operativo:** mobile first; las tareas de guardia, control de stock y observaciones deben funcionar primero en teléfono y tablet, con controles táctiles y lectura rápida.
- **Administrativo:** tablet y PC first; los resúmenes, tablas y gestión requieren más superficie horizontal, sin perder adaptación a pantallas menores.
- **Base compartida:** ningún estado importante depende solo del color, el foco de teclado permanece visible y los layouts deben conservar legibilidad entre 320 px y escritorio.
