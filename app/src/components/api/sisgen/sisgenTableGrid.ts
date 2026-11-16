/** Compact kardex + doc button; remaining columns share the rest. */
export const SISGEN_TABLE_GRID =
    "grid items-center gap-x-3 gap-y-2 px-4 [grid-template-columns:minmax(7.5rem,9.5rem)_minmax(3.5rem,0.7fr)_minmax(5rem,0.85fr)_minmax(3.75rem,0.7fr)_minmax(3.75rem,0.7fr)_minmax(8rem,1.6fr)_minmax(6rem,1.1fr)_minmax(4.5rem,0.8fr)_minmax(6.5rem,0.95fr)]"

export const sisgenCol = {
    kardex: "min-w-0",
    instrumento: "text-center",
    fecha: "text-center",
    folioIni: "min-w-0 text-center",
    folioFin: "min-w-0 text-center",
    acto: "min-w-0 truncate",
    estado: "min-w-0",
    validacion: "min-w-0",
    action: "flex justify-center",
} as const
