import { Search, X } from "lucide-react"

export type KardexPresenceFilter = "" | "true" | "false"

export interface IngresosFilterValues {
    fecha_emision_desde: string
    fecha_emision_hasta: string
    persona_documento: string
    persona_nombres: string
    kardex: string
    has_kardex: KardexPresenceFilter
    usuario: string
}

interface Props extends IngresosFilterValues {
    setFechaEmisionDesde: (value: string) => void
    setFechaEmisionHasta: (value: string) => void
    setPersonaDocumento: (value: string) => void
    setPersonaNombres: (value: string) => void
    setKardex: (value: string) => void
    setHasKardex: (value: KardexPresenceFilter) => void
    setUsuario: (value: string) => void
    onClear: () => void
    loading?: boolean
}

const IngresosFilters = ({
    fecha_emision_desde,
    fecha_emision_hasta,
    persona_documento,
    persona_nombres,
    kardex,
    has_kardex,
    usuario,
    setFechaEmisionDesde,
    setFechaEmisionHasta,
    setPersonaDocumento,
    setPersonaNombres,
    setKardex,
    setHasKardex,
    setUsuario,
    onClear,
    loading = false,
}: Props) => {
    const hasFilters =
        fecha_emision_desde.trim() !== "" ||
        fecha_emision_hasta.trim() !== "" ||
        persona_documento.trim() !== "" ||
        persona_nombres.trim() !== "" ||
        kardex.trim() !== "" ||
        has_kardex.trim() !== "" ||
        usuario.trim() !== ""

    const inputClassName =
        "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"

    return (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-sky-600" aria-hidden />
                    <p className="text-sm font-semibold text-slate-800">Filtros de búsqueda</p>
                </div>
                {hasFilters && (
                    <button
                        type="button"
                        onClick={onClear}
                        disabled={loading}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
                    >
                        <X className="h-3 w-3" aria-hidden />
                        Limpiar
                    </button>
                )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <label className="block text-xs">
                    <span className="mb-1 block font-medium text-slate-600">
                        Fecha emisión desde
                    </span>
                    <input
                        type="date"
                        value={fecha_emision_desde}
                        onChange={(e) => setFechaEmisionDesde(e.target.value)}
                        className={inputClassName}
                    />
                </label>
                <label className="block text-xs">
                    <span className="mb-1 block font-medium text-slate-600">
                        Fecha emisión hasta
                    </span>
                    <input
                        type="date"
                        value={fecha_emision_hasta}
                        min={fecha_emision_desde || undefined}
                        onChange={(e) => setFechaEmisionHasta(e.target.value)}
                        className={inputClassName}
                    />
                </label>
                <label className="block text-xs">
                    <span className="mb-1 block font-medium text-slate-600">
                        Documento persona
                    </span>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={persona_documento}
                        onChange={(e) =>
                            setPersonaDocumento(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="Buscar por documento..."
                        className={`${inputClassName} font-mono`}
                    />
                </label>
                <label className="block text-xs">
                    <span className="mb-1 block font-medium text-slate-600">
                        Nombres persona
                    </span>
                    <input
                        type="text"
                        value={persona_nombres}
                        onChange={(e) => setPersonaNombres(e.target.value)}
                        placeholder="Buscar por nombres..."
                        className={inputClassName}
                    />
                </label>
                <label className="block text-xs">
                    <span className="mb-1 block font-medium text-slate-600">
                        Kardex
                    </span>
                    <input
                        type="text"
                        value={kardex}
                        onChange={(e) => setKardex(e.target.value)}
                        placeholder="Ej. KAR0001-2026"
                        className={`${inputClassName} font-mono`}
                    />
                </label>
                <label className="block text-xs sm:col-span-2 lg:col-span-1">
                    <span className="mb-1 block font-medium text-slate-600">Usuario</span>
                    <input
                        type="text"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        placeholder="Buscar por usuario..."
                        className={inputClassName}
                    />
                </label>
                <div className="block text-xs sm:col-span-2 lg:col-span-3">
                    <span className="mb-1 block font-medium text-slate-600">
                        Relación con kardex
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { value: "", label: "Todos" },
                            { value: "true", label: "Con kardex" },
                            { value: "false", label: "Sin kardex" },
                        ].map((option) => {
                            const active = has_kardex === option.value

                            return (
                                <button
                                    key={option.value || "all"}
                                    type="button"
                                    onClick={() =>
                                        setHasKardex(option.value as KardexPresenceFilter)
                                    }
                                    disabled={loading}
                                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                                        active
                                            ? "border-sky-600 bg-sky-600 text-white"
                                            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                                    }`}
                                >
                                    {option.label}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IngresosFilters
