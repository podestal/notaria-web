import {
    getSisgenValidationCounts,
    getSisgenValidationTotal,
    type SisgenValidationCounts,
} from "../../../utils/sisgenSendState"
import type { SISGENDocument } from "../../../services/sisgen/searchSisgenService"
import { CheckCircle2 } from "lucide-react"

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
                ? "bg-red-50 text-red-700 ring-red-200"
                : tone === "warning"
                  ? "bg-amber-50 text-amber-700 ring-amber-200"
                  : "bg-slate-100 text-slate-700 ring-slate-200"
            : "bg-white text-slate-400 ring-slate-200"

    return (
        <span
            title={label}
            className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ring-1 ${toneClass}`}
        >
            <span className="font-medium opacity-80">{label}</span>
            {count}
        </span>
    )
}

const SisgenValidationCountsCell = ({ doc }: Props) => {
    const counts: SisgenValidationCounts = getSisgenValidationCounts(doc)
    const total = getSisgenValidationTotal(counts)

    if (total === 0) {
        return (
            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-200">
                <CheckCircle2 className="h-3 w-3" />
                Sin incidencias
            </span>
        )
    }

    return (
        <div className="flex flex-wrap gap-1 leading-snug">
            <CountLine label="Err." count={counts.errores} tone="error" />
            <CountLine label="Obs." count={counts.observaciones} tone="warning" />
            <CountLine label="Pers." count={counts.personas} tone="neutral" />
        </div>
    )
}

export default SisgenValidationCountsCell
