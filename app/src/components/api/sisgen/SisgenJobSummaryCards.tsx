import type { SisgenJobDocumentSummary } from "../../../utils/sisgenJobSummary"

interface Props {
    summary: SisgenJobDocumentSummary
    compact?: boolean
}

const SisgenJobSummaryCards = ({ summary, compact = false }: Props) => (
    <div
        className={`grid gap-3 rounded-lg bg-slate-50 text-xs ${
            compact ? "grid-cols-3 p-2" : "grid-cols-2 p-3 sm:grid-cols-4"
        }`}
    >
        <div className="text-center">
            <p className="font-semibold text-slate-500">Total</p>
            <p className={`mt-1 font-bold text-slate-900 ${compact ? "text-base" : "text-lg"}`}>
                {summary.total}
            </p>
        </div>
        <div className="text-center">
            <p className="font-semibold text-green-700">Completados</p>
            <p className={`mt-1 font-bold text-green-800 ${compact ? "text-base" : "text-lg"}`}>
                {summary.completados}
            </p>
        </div>
        <div className="text-center">
            <p className="font-semibold text-red-700">Fallidos</p>
            <p className={`mt-1 font-bold text-red-800 ${compact ? "text-base" : "text-lg"}`}>
                {summary.fallidos}
            </p>
        </div>
        {(summary.omitidos > 0 || summary.enProceso > 0 || summary.pendientes > 0) && (
            <div className="text-center">
                <p className="font-semibold text-amber-700">Pendientes / omitidos</p>
                <p className={`mt-1 font-bold text-amber-800 ${compact ? "text-base" : "text-lg"}`}>
                    {summary.pendientes + summary.enProceso + summary.omitidos}
                </p>
            </div>
        )}
    </div>
)

export default SisgenJobSummaryCards
