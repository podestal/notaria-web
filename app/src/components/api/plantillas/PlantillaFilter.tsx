import { useEffect, useMemo, type SetStateAction } from "react"
import useAuthStore from "../../../store/useAuthStore"
import useGetTipoActo from "../../../hooks/api/tipoActo/useGetTipoActo"
import useGetTipoKardexList from "../../../hooks/api/tipoKardex/useGetTipoKardexList"
import type { TipoActo } from "../../../services/api/tipoActosService"
import type { Tipokardex } from "../../../services/api/tipokardexService"
import getTitleCase from "../../../utils/getTitleCase"
import SearchableDropdownInput from "../../ui/SearchableDropdownInput"

const TIPOKAR_IDS = [1, 2, 3, 4, 5] as const

const tiposParaFiltro = (list: Tipokardex[]): Tipokardex[] =>
    TIPOKAR_IDS.map((id) => list.find((t) => t.idtipkar === id) ?? { idtipkar: id, nomtipkar: `Tipo ${id}`, tipkar: "" })

const formatActoLabel = (acto: TipoActo) =>
    `${acto.desacto}${acto.actosunat ? ` · Sunat: ${acto.actosunat}` : ""}${acto.actouif ? ` · UIF: ${acto.actouif}` : ""}`

export type PlantillasTabVariant = "protocolares" | "extraprotocolares"

interface Props {
    codeActs: string
    fkType: string
    nameTemplate: string
    setCodeActs: (value: string) => void
    setFkType: (value: string) => void
    setNameTemplate: (value: string) => void
    variant?: PlantillasTabVariant
}

const PlantillaFilter = ({
    codeActs,
    fkType,
    nameTemplate,
    setCodeActs,
    setFkType,
    setNameTemplate,
    variant = "protocolares",
}: Props) => {
    const isExtraprotocolares = variant === "extraprotocolares"
    const access = useAuthStore((s) => s.access_token) || ""
    const { data: tiposKardexRaw = [] } = useGetTipoKardexList()
    const tiposKardex = useMemo(() => tiposParaFiltro(tiposKardexRaw), [tiposKardexRaw])

    const { data: tipoActos = [], isLoading, isError } = useGetTipoActo({
        access,
        enabled: !isExtraprotocolares,
    })

    const actosFiltrados = useMemo(
        () => tipoActos.filter((a) => !fkType || String(a.idtipkar) === fkType),
        [tipoActos, fkType]
    )

    const dropdownOptions = useMemo(
        () => actosFiltrados.map((a) => ({ id: a.idtipoacto, label: formatActoLabel(a) })),
        [actosFiltrados]
    )

    const selectedActo = useMemo(() => {
        if (!codeActs) return null
        const acto = actosFiltrados.find((a) => a.idtipoacto === codeActs)
        return acto ? { id: acto.idtipoacto, label: formatActoLabel(acto) } : null
    }, [codeActs, actosFiltrados])

    useEffect(() => {
        if (isExtraprotocolares || isLoading || !codeActs) return
        const ok = actosFiltrados.some((a) => a.idtipoacto === codeActs)
        if (!ok) setCodeActs("")
    }, [isExtraprotocolares, actosFiltrados, codeActs, setCodeActs, isLoading])

    const handleTipokarClick = (id: number) => {
        setFkType(fkType === String(id) ? "" : String(id))
    }

    const setSelectedActo = (updater: SetStateAction<{ id: string; label: string } | null>) => {
        const next = typeof updater === "function" ? updater(selectedActo) : updater
        setCodeActs(next?.id ?? "")
    }

    const limpiar = () => {
        setNameTemplate("")
        setCodeActs("")
        if (!isExtraprotocolares) setFkType("")
    }

    return (
        <section className="mb-8 rounded-xl border border-slate-200/80 bg-gradient-to-b from-slate-50 to-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-sm font-semibold tracking-tight text-slate-800">Filtrar plantillas</h2>
                    <p className="text-xs text-slate-500">
                        {isExtraprotocolares ? "Buscar por nombre" : "Nombre, tipo de kardex y acto"}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={limpiar}
                    className="self-start  cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 sm:self-auto sm:text-sm"
                >
                    Limpiar filtros
                </button>
            </div>

            <div className={`grid gap-6 ${isExtraprotocolares ? "" : "lg:grid-cols-2 lg:gap-8"}`}>
                <div className="flex flex-col gap-2">
                    <label htmlFor="plantilla-filter-name" className="text-xs font-semibold text-slate-700">
                        Nombre de plantilla
                    </label>
                    <input
                        id="plantilla-filter-name"
                        type="text"
                        value={nameTemplate}
                        onChange={(e) => setNameTemplate(e.target.value)}
                        placeholder="Buscar por nombre…"
                        className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-3 pr-3 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>

                {!isExtraprotocolares && (
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-semibold text-slate-700">Tipo kardex</span>
                        <div className="flex flex-wrap gap-2" role="group" aria-label="Tipo kardex">
                            {tiposKardex.map((t) => {
                                const active = fkType === String(t.idtipkar)
                                return (
                                    <button
                                        key={t.idtipkar}
                                        type="button"
                                        onClick={() => handleTipokarClick(t.idtipkar)}
                                        aria-pressed={active}
                                        title={`Tipo kardex ${t.idtipkar}`}
                                        className={`max-w-[11rem] cursor-pointer rounded-lg border px-2.5 py-2 text-center text-xs leading-snug transition-colors sm:text-sm ${
                                            active
                                                ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/25 ring-2 ring-blue-600 ring-offset-2 hover:bg-blue-700"
                                                : "bg-white hover:border-blue-700 hover:bg-blue-700 hover:text-white"
                                        }`}
                                    >
                                        {getTitleCase(t.nomtipkar)}
                                    </button>
                                )
                            })}
                        </div>
                        <p className="text-[11px] text-slate-500">
                            Un solo tipo a la vez. Vuelve a pulsar el mismo para quitar.
                        </p>
                    </div>
                )}
            </div>
            {!isExtraprotocolares && (
                <div className="mt-6 flex min-w-0 flex-col gap-2">
                    <span className="text-xs font-semibold text-slate-700">Acto</span>
                    {isLoading && <p className="text-xs text-slate-500">Cargando actos…</p>}
                    {isError && <p className="text-xs text-red-600">No se pudieron cargar los actos.</p>}
                    {!isLoading && !isError && (
                        <div className="-my-2">
                            <SearchableDropdownInput
                                options={dropdownOptions}
                                selected={selectedActo}
                                setSelected={setSelectedActo}
                                placeholder={
                                    fkType ? "Buscar acto…" : "Elija tipo kardex o busque acto…"
                                }
                            />
                        </div>
                    )}
                </div>
            )}
        </section>
    )
}

export default PlantillaFilter
