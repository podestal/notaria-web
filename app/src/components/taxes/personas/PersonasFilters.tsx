import { Search, X } from "lucide-react"

export interface PersonasFilterValues {
    nombres: string
    apellido_paterno: string
    apellido_materno: string
    razon_social: string
    numero_documento: string
}

interface Props extends PersonasFilterValues {
    setNombres: (value: string) => void
    setApellidoPaterno: (value: string) => void
    setApellidoMaterno: (value: string) => void
    setRazonSocial: (value: string) => void
    setNumeroDocumento: (value: string) => void
    onClear: () => void
    loading?: boolean
}

const PersonasFilters = ({
    nombres,
    apellido_paterno,
    apellido_materno,
    razon_social,
    numero_documento,
    setNombres,
    setApellidoPaterno,
    setApellidoMaterno,
    setRazonSocial,
    setNumeroDocumento,
    onClear,
    loading = false,
}: Props) => {
    const hasFilters =
        nombres.trim() !== "" ||
        apellido_paterno.trim() !== "" ||
        apellido_materno.trim() !== "" ||
        razon_social.trim() !== "" ||
        numero_documento.trim() !== ""

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
                    <span className="mb-1 block font-medium text-slate-600">Nombres</span>
                    <input
                        type="text"
                        value={nombres}
                        onChange={(e) => setNombres(e.target.value)}
                        placeholder="Buscar por nombres..."
                        className={inputClassName}
                    />
                </label>
                <label className="block text-xs">
                    <span className="mb-1 block font-medium text-slate-600">Apellido paterno</span>
                    <input
                        type="text"
                        value={apellido_paterno}
                        onChange={(e) => setApellidoPaterno(e.target.value)}
                        placeholder="Buscar por apellido paterno..."
                        className={inputClassName}
                    />
                </label>
                <label className="block text-xs">
                    <span className="mb-1 block font-medium text-slate-600">Apellido materno</span>
                    <input
                        type="text"
                        value={apellido_materno}
                        onChange={(e) => setApellidoMaterno(e.target.value)}
                        placeholder="Buscar por apellido materno..."
                        className={inputClassName}
                    />
                </label>
                <label className="block text-xs">
                    <span className="mb-1 block font-medium text-slate-600">Razón social</span>
                    <input
                        type="text"
                        value={razon_social}
                        onChange={(e) => setRazonSocial(e.target.value)}
                        placeholder="Buscar por razón social..."
                        className={inputClassName}
                    />
                </label>
                <label className="block text-xs sm:col-span-2 lg:col-span-1">
                    <span className="mb-1 block font-medium text-slate-600">Número de documento</span>
                    <input
                        type="text"
                        value={numero_documento}
                        onChange={(e) => setNumeroDocumento(e.target.value)}
                        placeholder="Buscar por número de documento..."
                        className={inputClassName}
                    />
                </label>
            </div>
        </div>
    )
}

export default PersonasFilters
