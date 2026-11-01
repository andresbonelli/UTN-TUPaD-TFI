import { useEffect } from "react";

interface MensajeConfirmacionProps {
    mensaje: string;
    onCerrar: () => void;
    duracion?: number;
}

export default function MensajeConfirmacion({
    mensaje,
    onCerrar,
    duracion = 5000,
}: MensajeConfirmacionProps) {
    useEffect(() => {
        const timer = window.setTimeout(() => {
            onCerrar();
        }, duracion);

        return () => {
            window.clearTimeout(timer);
        };
    }, [duracion, onCerrar]);

    return (
        <div className="rounded-lg border border-verde/30 bg-verde/10 p-3 text-sm font-semibold text-verde">
            {mensaje}
        </div>
    );
}