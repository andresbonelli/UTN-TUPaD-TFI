import type {
    EstadoTurno,
    HorarioTurno,
} from "../interfaces/Turno";

export function obtenerColorEstado(
    estado: EstadoTurno
): string {
    if (estado === "PROGRAMADO") {
        return "bg-azul/10 text-azul";
    }

    if (estado === "EN_CURSO") {
        return "bg-verde/10 text-verde";
    }

    if (estado === "CANCELADO") {
        return "bg-coral/10 text-coral";
    }

    return "bg-petro/10 text-petro";
}

export function obtenerTextoEstado(
    estado: EstadoTurno
): string {
    if (estado === "PROGRAMADO") {
        return "Programado";
    }

    if (estado === "EN_CURSO") {
        return "En curso";
    }

    if (estado === "FINALIZADO") {
        return "Finalizado";
    }

    return "Cancelado";
}

export function obtenerTextoHorario(
    horario: HorarioTurno
): string {
    if (horario === "MANIANA") {
        return "Mañana";
    }

    if (horario === "TARDE") {
        return "Tarde";
    }

    return "Noche";
}