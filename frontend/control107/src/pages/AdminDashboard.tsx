import { Link } from "react-router-dom";

import { useResumenOperativo } from "../hooks/useTurnos";

import {
  obtenerColorEstado,
  obtenerTextoEstado,
  obtenerTextoHorario,
} from "../utils/turno";

export default function AdminDashboard() {
  const {
    data: resumen,
    isLoading,
    isError,
  } = useResumenOperativo();

  const turnosConAlertasCriticas =
    resumen?.turnosConInconsistencias.filter((turno) =>
      turno.controlInsumos.some(
        (insumo) =>
          insumo.ingresoFaltante > 0 &&
          insumo.esCritico,
      ),
    ) ?? [];

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-petro">
          Panel de Administración
        </h2>

        <p className="mt-2 text-sm text-petro/60">
          Gestiona los recursos principales de Control107.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Link
          to="/admin/categorias"
          className="rounded-xl bg-blanco p-6 shadow-sm transition hover:shadow-md"
        >
          <h3 className="text-lg font-semibold text-petro">
            Categorías
          </h3>

          <p className="mt-2 text-sm text-petro/60">
            Gestiona las categorías y sus colores.
          </p>
        </Link>

        <Link
          to="/admin/insumos"
          className="rounded-xl bg-blanco p-6 shadow-sm transition hover:shadow-md"
        >
          <h3 className="text-lg font-semibold text-petro">
            Insumos
          </h3>

          <p className="mt-2 text-sm text-petro/60">
            Consulta los insumos y sus puntos de control.
          </p>
        </Link>

        <Link
          to="/admin/ambulancias"
          className="rounded-xl bg-blanco p-6 shadow-sm transition hover:shadow-md"
        >
          <h3 className="text-lg font-semibold text-petro">
            Ambulancias
          </h3>

          <p className="mt-2 text-sm text-petro/60">
            Consulta las ambulancias registradas.
          </p>
        </Link>

        <Link
          to="/admin/usuarios"
          className="rounded-xl bg-blanco p-6 shadow-sm transition hover:shadow-md"
        >
          <h3 className="text-lg font-semibold text-petro">
            Usuarios
          </h3>

          <p className="mt-2 text-sm text-petro/60">
            Consulta los usuarios y roles registrados.
          </p>
        </Link>

        <Link
          to="/admin/turnos"
          className="rounded-xl bg-blanco p-6 shadow-sm transition hover:shadow-md"
        >
          <h3 className="text-lg font-semibold text-petro">
            Turnos
          </h3>

          <p className="mt-2 text-sm text-petro/60">
            Consulta los turnos registrados y su estado.
          </p>
        </Link>

        <Link
          to="/admin/estadisticas"
          className="rounded-xl bg-blanco p-6 shadow-sm transition hover:shadow-md"
        >
          <h3 className="text-lg font-semibold text-petro">
            Estadísticas
          </h3>

          <p className="mt-2 text-sm text-petro/60">
            Consulta estadísticas generales del sistema.
          </p>
        </Link>
      </div>

      <div className="my-8 border-t border-petro/10" />

      <div className="mb-4">
        <h2 className="text-xl font-semibold text-petro">
          Resumen operativo
        </h2>

        <p className="mt-1 text-sm text-petro/60">
          Estado actual de la operación.
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-xl bg-blanco p-6 shadow-sm">
          <p className="text-sm text-petro/60">
            Cargando resumen operativo...
          </p>
        </div>
      ) : isError || !resumen ? (
        <div className="rounded-xl border border-coral/30 bg-coral/5 p-6">
          <p className="text-sm font-semibold text-coral">
            No se pudo cargar el resumen operativo.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl bg-blanco p-6 shadow-sm">
              <p className="text-sm font-medium text-petro/60">
                Turnos activos
              </p>

              <p className="mt-2 text-3xl font-bold text-petro">
                {resumen.turnosActivos}
              </p>
            </div>

            <div className="rounded-xl bg-blanco p-6 shadow-sm">
              <p className="text-sm font-medium text-petro/60">
                Ambulancias disponibles
              </p>

              <p className="mt-2 text-3xl font-bold text-turquesa">
                {resumen.ambulanciasDisponibles}

                <span className="text-lg font-semibold text-petro/40">
                  {" "}
                  / {resumen.ambulanciasTotales}
                </span>
              </p>
            </div>

            <div className="rounded-xl bg-blanco p-6 shadow-sm">
              <p className="text-sm font-medium text-petro/60">
                Alertas críticas
              </p>

              <p
                className={
                  resumen.alertas > 0
                    ? "mt-2 text-3xl font-bold text-coral"
                    : "mt-2 text-3xl font-bold text-verde"
                }
              >
                {resumen.alertas}
              </p>

              <p className="mt-1 text-xs text-petro/50">
                Turnos con insumos críticos faltantes.
              </p>
            </div>

            <div className="rounded-xl bg-blanco p-6 shadow-sm">
              <p className="text-sm font-medium text-petro/60">
                Turnos con faltantes
              </p>

              <p
                className={
                  resumen.turnosConInconsistencias.length > 0
                    ? "mt-2 text-3xl font-bold text-ambar"
                    : "mt-2 text-3xl font-bold text-verde"
                }
              >
                {resumen.turnosConInconsistencias.length}
              </p>

              <p className="mt-1 text-xs text-petro/50">
                Turnos activos con insumos faltantes.
              </p>
            </div>
          </div>

          {resumen.turnosConInconsistencias.length > 0 && (
            <div className="mt-8 border-t border-petro/10 pt-8">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-petro">
                  Turnos con faltantes
                </h2>

                <p className="mt-1 text-sm text-petro/60">
                  Turnos activos que presentan insumos faltantes en el control
                  de ingreso.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {resumen.turnosConInconsistencias.map((turno) => (
                  <div
                    key={turno.id}
                    className="rounded-xl bg-blanco p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-petro">
                          Turno #{turno.id}
                        </p>

                        <p className="mt-1 text-sm text-petro/60">
                          {turno.fecha} · {obtenerTextoHorario(turno.horario)}
                        </p>

                        <p className="mt-1 text-sm text-petro/60">
                          Ambulancia {turno.ambulancia.patente}
                        </p>
                      </div>

                      <span
                        className={`rounded-md px-2 py-1 text-xs font-semibold ${obtenerColorEstado(
                          turno.estado,
                        )}`}
                      >
                        {obtenerTextoEstado(turno.estado)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      {turnosConAlertasCriticas.length > 0 && (
        <div className="mt-8 border-t border-petro/10 pt-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-coral">
              Alertas críticas
            </h2>

            <p className="mt-1 text-sm text-petro/60">
              Turnos activos con insumos críticos faltantes.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {turnosConAlertasCriticas.map((turno) => (
              <div
                key={turno.id}
                className="rounded-xl border border-coral/20 bg-coral/5 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-petro">
                      Turno #{turno.id}
                    </p>

                    <p className="mt-1 text-sm text-petro/60">
                      {turno.fecha} · {obtenerTextoHorario(turno.horario)}
                    </p>

                    <p className="mt-1 text-sm text-petro/60">
                      Ambulancia {turno.ambulancia.patente}
                    </p>
                  </div>

                  <span className="rounded-md bg-coral/10 px-2 py-1 text-xs font-semibold text-coral">
                    Crítico
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}