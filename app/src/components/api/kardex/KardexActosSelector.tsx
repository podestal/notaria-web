import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { useMemo } from "react"
import { TipoActo } from "../../../services/api/tipoActosService"

interface Props {
    tipoActos: TipoActo[]
    contratos: string[]
    setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>
}

const KardexActosSelector = ({
    tipoActos,
    contratos,
    setSelectedIds,
}: Props) => {
    const actos = useMemo(
        () => tipoActos.filter((acto) => contratos.includes(acto.idtipoacto)),
        [tipoActos, contratos],
    )

    if (actos.length === 0) {
        return (
            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
                <p className="text-sm font-medium text-slate-600">Sin actos seleccionados</p>
                <p className="mt-1 text-xs text-slate-500">
                    Busque y agregue al menos un acto para continuar.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            <AnimatePresence mode="popLayout">
                {actos.map((acto) => (
                    <motion.div
                        key={acto.idtipoacto}
                        layout
                        exit={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        initial={{ opacity: 0, scale: 0.98 }}
                        className="flex items-stretch gap-2"
                    >
                        <div className="min-w-0 flex-1 rounded-lg border-2 border-blue-600 bg-gradient-to-r from-blue-600 to-blue-500 px-3 py-2.5 shadow-md ring-2 ring-blue-200">
                            <p className="text-sm font-bold text-white">{acto.desacto}</p>
                            <div className="mt-1.5 flex flex-wrap gap-2">
                                {acto.actosunat && (
                                    <span className="rounded-md bg-blue-700/80 px-2 py-0.5 text-[10px] font-semibold text-blue-50">
                                        SUNAT: {acto.actosunat}
                                    </span>
                                )}
                                {acto.actouif && (
                                    <span className="rounded-md bg-blue-700/80 px-2 py-0.5 text-[10px] font-semibold text-blue-50">
                                        UIF: {acto.actouif}
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() =>
                                setSelectedIds((prev) =>
                                    prev.filter((id) => id !== acto.idtipoacto),
                                )
                            }
                            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50 px-2.5 text-red-600 transition hover:bg-red-100"
                            title="Quitar acto"
                        >
                            <X className="h-4 w-4" aria-hidden />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}

export default KardexActosSelector
