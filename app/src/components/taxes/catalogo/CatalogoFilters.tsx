import { Search, X } from "lucide-react"

interface Props {
    codigo: string
    descripcion: string
    setCodigo: (value: string) => void
    setDescripcion: (value: string) => void
    onClear: () => void
    loading?: boolean
}

const CatalogoFilters = ({
    codigo,
    descripcion,
    setCodigo,
    setDescripcion,
    onClear,
    loading = false,
}: Props) => {
    const hasFilters = codigo.trim() !== "" || descripcion.trim() !== ""

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
            <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-xs">
                    <span className="mb-1 block font-medium text-slate-600">Código</span>
                    <input
                        type="text"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        placeholder="Buscar por código..."
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                    />
                </label>
                <label className="block text-xs">
                    <span className="mb-1 block font-medium text-slate-600">Descripción</span>
                    <input
                        type="text"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Buscar por descripción..."
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                    />
                </label>
            </div>
        </div>
    )
}

export default CatalogoFilters
