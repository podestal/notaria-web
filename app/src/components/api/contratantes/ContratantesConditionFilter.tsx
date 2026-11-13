import { useCallback, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, ChevronDown, ListChecks } from "lucide-react"
import FilteredActoCondiciones from "../actoCondicion/FilteredActoCondiciones"
import getTipoActoIdArray from "../../../utils/getTipoActoIdArray"
import { formatOtherCondiciones } from "../../../utils/representanteCondicionConflict"

interface Props {
    kardex: string
    idtipoacto: string
    selectedActos: string[]
    setSelectedActos: React.Dispatch<React.SetStateAction<string[]>>
    expanded: boolean
    onToggle: () => void
    autoSelectRepresentanteCondicion?: boolean
    clearRepresentanteCondicion?: boolean
}

const ContratantesConditionFilter = ({
    idtipoacto,
    selectedActos,
    setSelectedActos,
    kardex,
    expanded,
    onToggle,
    autoSelectRepresentanteCondicion = false,
    clearRepresentanteCondicion = false,
}: Props) => {
    const tiposActos = getTipoActoIdArray(idtipoacto)
    const selectedCount = selectedActos.length
    const [conflictsByActo, setConflictsByActo] = useState<Record<string, string[]>>({})

    const handleConflictLabelsChange = useCallback((tipoActo: string, otherLabels: string[]) => {
        setConflictsByActo((prev) => {
            const prevLabels = prev[tipoActo] ?? []
            const same =
                prevLabels.length === otherLabels.length &&
                prevLabels.every((label, index) => label === otherLabels[index])
            if (same) return prev
            if (otherLabels.length === 0) {
                if (!(tipoActo in prev)) return prev
                const next = { ...prev }
                delete next[tipoActo]
                return next
            }
            return { ...prev, [tipoActo]: otherLabels }
        })
    }, [])

    const conflictOthers = useMemo(() => {
        const seen = new Set<string>()
        const labels: string[] = []
        for (const group of Object.values(conflictsByActo)) {
            for (const label of group) {
                const key = label.trim().toLocaleLowerCase("es")
                if (!key || seen.has(key)) continue
                seen.add(key)
                labels.push(label.trim())
            }
        }
        return labels
    }, [conflictsByActo])

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-slate-50"
            >
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                        <ListChecks className="h-4 w-4" aria-hidden />
                    </span>
                    <div>
                        <p className="text-sm font-semibold text-slate-800">Condiciones</p>
                        <p className="text-xs text-slate-500">
                            {selectedCount === 0
                                ? "Ninguna seleccionada"
                                : `${selectedCount} condición${selectedCount === 1 ? "" : "es"} seleccionada${selectedCount === 1 ? "" : "s"}`}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {conflictOthers.length > 0 && (
                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
                            Revisar
                        </span>
                    )}
                    {selectedCount > 0 && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                            {selectedCount}
                        </span>
                    )}
                    <ChevronDown
                        className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`}
                        aria-hidden
                    />
                </div>
            </button>

            {/* Keep mounted while collapsed so representante ↔ condición sync still runs */}
            <motion.div
                initial={false}
                animate={{
                    height: expanded ? "auto" : 0,
                    opacity: expanded ? 1 : 0,
                }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden border-t border-slate-100 bg-slate-50/60"
                aria-hidden={!expanded}
            >
                <div className="space-y-3 p-4">
                    {conflictOthers.length > 0 && (
                        <div
                            role="alert"
                            className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-950"
                        >
                            <AlertTriangle
                                className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
                                aria-hidden
                            />
                            <div>
                                <p className="font-semibold">
                                    Representante con otra condición
                                </p>
                                <p className="mt-1 leading-snug text-amber-900/90">
                                    Está marcado como Representante y también como{" "}
                                    <span className="font-semibold">
                                        {formatOtherCondiciones(conflictOthers)}
                                    </span>
                                    . Un representante no debería ser a la vez comprador,
                                    vendedor u otra condición del acto.
                                </p>
                            </div>
                        </div>
                    )}
                    {tiposActos.length === 0 ? (
                        <p className="rounded-lg border border-dashed border-slate-200 bg-white px-4 py-6 text-center text-xs text-slate-500">
                            No hay tipos de acto configurados para este kardex.
                        </p>
                    ) : (
                        tiposActos.map((tipo) => (
                            <FilteredActoCondiciones
                                key={tipo}
                                kardex={kardex}
                                idtipoacto={tipo}
                                selectedActos={selectedActos}
                                setSelectedActos={setSelectedActos}
                                autoSelectRepresentanteCondicion={autoSelectRepresentanteCondicion}
                                clearRepresentanteCondicion={clearRepresentanteCondicion}
                                onConflictLabelsChange={handleConflictLabelsChange}
                            />
                        ))
                    )}
                </div>
            </motion.div>
        </div>
    )
}

export default ContratantesConditionFilter
