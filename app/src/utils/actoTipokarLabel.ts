import type { Tipokardex } from "../services/api/tipokardexService"

/** Etiqueta legible para `idtipkar` usando la lista de tipos de kardex. */
export function tipokarDescripcion(idtipkar: number, tipos: Tipokardex[] | undefined | null): string {
    if (!Array.isArray(tipos) || tipos.length === 0) return String(idtipkar)
    const found = tipos.find((t) => Number(t.idtipkar) === Number(idtipkar))
    return found?.nomtipkar?.trim() ? found.nomtipkar.trim() : String(idtipkar)
}
