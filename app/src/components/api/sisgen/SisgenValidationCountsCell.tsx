import {
    getSisgenValidationCounts,
    getSisgenValidationTotal,
    type SisgenValidationCounts,
} from "../../../utils/sisgenSendState"
import type { SISGENDocument } from "../../../services/sisgen/searchSisgenService"

interface Props {
    doc: SISGENDocument
}

const CountLine = ({
    label,
    count,
    tone,
}: {
    label: string
    count: number
    tone: "error" | "warning" | "neutral"
}) => {
    const toneClass =
        count > 0
            ? tone === "error"
                ? "text-red-600 font-semibold"
                : tone === "warning"
                  ? "text-amber-700 font-semibold"
                  : "text-slate-700 font-semibold"
            : "text-slate-400"

    return (
        <span className={toneClass}>
            {label}: {count}
        </span>
    )
}

const SisgenValidationCountsCell = ({ doc }: Props) => {
    const counts: SisgenValidationCounts = getSisgenValidationCounts(doc)
    const total = getSisgenValidationTotal(counts)

    return (
        <div className="flex flex-col gap-0.5 text-[10px] leading-snug">
            {total === 0 && (
                <p className="mb-0.5 font-medium text-green-600">Sin incidencias</p>
            )}
            <CountLine label="Errores" count={counts.errores} tone="error" />
            <CountLine label="Obs." count={counts.observaciones} tone="warning" />
            <CountLine label="Pers." count={counts.personas} tone="neutral" />
        </div>
    )
}

export default SisgenValidationCountsCell
