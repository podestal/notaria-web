import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, ListChecks } from "lucide-react"
import FilteredActoCondiciones from "../actoCondicion/FilteredActoCondiciones"
import getTipoActoIdArray from "../../../utils/getTipoActoIdArray"

interface Props {
    kardex: string
    idtipoacto: string
    selectedActos: string[]
    setSelectedActos: React.Dispatch<React.SetStateAction<string[]>>
    expanded: boolean
    onToggle: () => void
}

const ContratantesConditionFilter = ({
    idtipoacto,
    selectedActos,
    setSelectedActos,
    kardex,
    expanded,
    onToggle,
}: Props) => {
    const tiposActos = getTipoActoIdArray(idtipoacto)
    const selectedCount = selectedActos.length

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-slate-50"
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

            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden border-t border-slate-100 bg-slate-50/60"
                    >
                        <div className="space-y-3 p-4">
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
                                    />
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ContratantesConditionFilter
