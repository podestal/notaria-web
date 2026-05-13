import type { Dispatch, SetStateAction } from "react"
import useGetTipoKardexList from "../../../hooks/api/tipoKardex/useGetTipoKardexList"

interface Props {
    desacto: string
    setDesacto: Dispatch<SetStateAction<string>>
    idtipoacto: string
    setIdtipoacto: Dispatch<SetStateAction<string>>
    idtipkar: string
    setIdtipkar: Dispatch<SetStateAction<string>>
    onLimpiar: () => void
}

const inputClass =
    "rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"

const ActoCondicionFilters = ({
    desacto,
    setDesacto,
    idtipoacto,
    setIdtipoacto,
    idtipkar,
    setIdtipkar,
    onLimpiar,
}: Props) => {
    const { data: tipoKardexList } = useGetTipoKardexList()
    const options = Array.isArray(tipoKardexList) ? tipoKardexList : []

    return (
        <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="acto-desacto" className="text-xs font-semibold text-slate-700">
                        Descripción del acto
                    </label>
                    <input
                        id="acto-desacto"
                        type="search"
                        value={desacto}
                        onChange={(e) => setDesacto(e.target.value)}
                        placeholder="Buscar por desacto…"
                        className={inputClass}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="acto-idtipoacto" className="text-xs font-semibold text-slate-700">
                        Id tipo de acto
                    </label>
                    <input
                        id="acto-idtipoacto"
                        type="text"
                        value={idtipoacto}
                        onChange={(e) => setIdtipoacto(e.target.value)}
                        placeholder="Ej. 039"
                        className={`${inputClass} font-mono`}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="acto-idtipkar" className="text-xs font-semibold text-slate-700">
                        Tipo de kardex
                    </label>
                    <select
                        id="acto-idtipkar"
                        value={idtipkar}
                        onChange={(e) => setIdtipkar(e.target.value)}
                        className={inputClass}
                    >
                        <option value="">Todos</option>
                        {options.map((k) => (
                            <option key={k.idtipkar} value={String(k.idtipkar)}>
                                {k.idtipkar} — {k.nomtipkar}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-end sm:col-span-2 lg:col-span-1 lg:justify-end">
                    <button
                        type="button"
                        onClick={onLimpiar}
                        className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                        Limpiar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ActoCondicionFilters
