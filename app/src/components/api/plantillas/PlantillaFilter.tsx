import { useEffect, useMemo, type SetStateAction } from "react"
import { motion } from "framer-motion"
import {
    BookOpen,
    Car,
    FileText,
    Home,
    Scale,
    type LucideIcon,
} from "lucide-react"
import useAuthStore from "../../../store/useAuthStore"
import useGetTipoActo from "../../../hooks/api/tipoActo/useGetTipoActo"
import useGetTipoKardexList from "../../../hooks/api/tipoKardex/useGetTipoKardexList"
import type { TipoActo } from "../../../services/api/tipoActosService"
import type { Tipokardex } from "../../../services/api/tipokardexService"
import getTitleCase from "../../../utils/getTitleCase"
import SearchableDropdownInput from "../../ui/SearchableDropdownInput"
import ExtraFiltersShell, {
    ExtraFilterField,
    ExtraFilterSearchButton,
    ExtraFilterTextField,
} from "../extraprotocolares/ExtraFiltersShell"

const TIPOKAR_IDS = [1, 2, 3, 4, 5] as const

/** Visual meta for protocolares tipos (1–5). Uses remappable slate/tint utilities (no text-white / bg-slate-900). */
const TIPOKAR_META: Record<
    number,
    { icon: LucideIcon; iconTone: string; active: string; dot: string; short: string }
> = {
    1: {
        icon: FileText,
        iconTone: "bg-sky-50 text-sky-600 ring-sky-100",
        active: "border-sky-500 ring-sky-500/25",
        dot: "bg-sky-500",
        short: "Escrituras",
    },
    2: {
        icon: Scale,
        iconTone: "bg-violet-50 text-violet-600 ring-violet-100",
        active: "border-violet-500 ring-violet-500/25",
        dot: "bg-violet-500",
        short: "No contenciosos",
    },
    3: {
        icon: Car,
        iconTone: "bg-amber-50 text-amber-600 ring-amber-100",
        active: "border-amber-500 ring-amber-500/25",
        dot: "bg-amber-500",
        short: "Transferencias",
    },
    4: {
        icon: Home,
        iconTone: "bg-emerald-50 text-emerald-600 ring-emerald-100",
        active: "border-emerald-500 ring-emerald-500/25",
        dot: "bg-emerald-500",
        short: "Garantías",
    },
    5: {
        icon: BookOpen,
        iconTone: "bg-indigo-50 text-indigo-600 ring-indigo-100",
        active: "border-indigo-500 ring-indigo-500/25",
        dot: "bg-indigo-500",
        short: "Libros",
    },
}

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
        <ExtraFiltersShell
            title={isExtraprotocolares ? "Filtrar plantillas:" : "Búsqueda por:"}
            columns={isExtraprotocolares ? 2 : 2}
        >
            <ExtraFilterTextField
                label="Nombre"
                value={nameTemplate}
                onChange={setNameTemplate}
                placeholder="Buscar por nombre…"
                index={0}
                colSpan={isExtraprotocolares ? 1 : 2}
            />

            {!isExtraprotocolares && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.08 }}
                    className="md:col-span-2 space-y-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                >
                    <div className="flex flex-wrap items-center justify-between gap-2 px-0.5">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                Tipo de kardex
                            </p>
                            <p className="text-[11px] text-slate-400">
                                Elija un tipo para filtrar actos y plantillas
                            </p>
                        </div>
                        {fkType ? (
                            <button
                                type="button"
                                onClick={() => setFkType("")}
                                className="text-[11px] font-semibold text-sky-600 hover:text-sky-800 hover:underline"
                            >
                                Quitar selección
                            </button>
                        ) : null}
                    </div>
                    <div
                        className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5"
                        role="group"
                        aria-label="Tipo kardex"
                    >
                        {tiposKardex.map((t, i) => {
                            const active = fkType === String(t.idtipkar)
                            const meta = TIPOKAR_META[t.idtipkar]
                            const Icon = meta?.icon ?? FileText
                            const label = meta?.short || getTitleCase(t.nomtipkar)
                            const fullName = getTitleCase(t.nomtipkar)

                            return (
                                <motion.button
                                    key={t.idtipkar}
                                    type="button"
                                    onClick={() => handleTipokarClick(t.idtipkar)}
                                    aria-pressed={active}
                                    title={fullName}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.04, duration: 0.25 }}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={`relative flex flex-col items-start gap-2 rounded-xl border bg-white px-3 py-3 text-left shadow-sm transition ${
                                        active
                                            ? `${meta?.active ?? "border-sky-500 ring-sky-500/25"} shadow-md ring-4`
                                            : "border-slate-200 hover:border-sky-300 hover:shadow-md"
                                    }`}
                                >
                                    <div className="flex w-full items-center justify-between gap-2">
                                        <span
                                            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ring-1 ${
                                                meta?.iconTone ?? "bg-sky-50 text-sky-600 ring-sky-100"
                                            }`}
                                        >
                                            <Icon size={18} aria-hidden />
                                        </span>
                                        {active && (
                                            <motion.span
                                                layoutId="plantilla-tipokar-dot"
                                                className={`h-2 w-2 shrink-0 rounded-full ${meta?.dot ?? "bg-sky-500"}`}
                                            />
                                        )}
                                    </div>
                                    <span className="min-w-0">
                                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            Tipo {t.idtipkar}
                                        </span>
                                        <span className="mt-0.5 block text-xs font-semibold leading-snug text-slate-800">
                                            {label}
                                        </span>
                                    </span>
                                </motion.button>
                            )
                        })}
                    </div>
                </motion.div>
            )}

            {!isExtraprotocolares && (
                <ExtraFilterField label="Acto" index={2} colSpan={2}>
                    {isLoading && <p className="text-[11px] text-slate-400">Cargando actos…</p>}
                    {isError && <p className="text-[11px] text-rose-600">No se pudieron cargar los actos.</p>}
                    {!isLoading && !isError && (
                        <div className="-my-1 min-w-0">
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
                </ExtraFilterField>
            )}

            <ExtraFilterSearchButton
                type="button"
                variant="clear"
                label="Limpiar"
                onClick={limpiar}
                index={3}
                colSpan={isExtraprotocolares ? 1 : 2}
            />
        </ExtraFiltersShell>
    )
}

export default PlantillaFilter
