import { useCategorias } from "../hooks/useCategorias";

interface CategoriaBadgeProps {
    nombre: string;
}

export default function CategoriaBadge({
    nombre,
}: CategoriaBadgeProps) {
    const { data: categorias = [] } = useCategorias();

    const categoria = categorias.find(
        (item) => item.nombre === nombre
    );

    const color = categoria?.color ?? "#087E8B";

    return (
        <span
            className="inline-block rounded-full border px-2 py-1 text-xs font-semibold"
            style={{
                borderColor: color,
                color: color,
                backgroundColor: `${color}15`,
            }}
        >
            {nombre}
        </span>
    );
}