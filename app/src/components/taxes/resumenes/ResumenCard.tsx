import { FileStack } from "lucide-react"
import type { Resumen } from "../../../services/taxes/resumenesService"
import getTitleCase from "../../../utils/getTitleCase"
import { formatLocalDate } from "../../../utils/formatLocalDate"

interface Props {
    resumen: Resumen
}

const displayValue = (value: string | null | undefined) => {
    if (!value || value === "-") return "—"
    return value
}

const SunatBadge = ({ ok, label }: { ok: boolean; label: string }) => (
    <span
        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            ok ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"
        }`}
    >
        {label}
    </span>
)

const ResumenCard = ({ resumen }: Props) => (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        <div className="px-4 py-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 gap-3">
                    <div className="rounded-xl border border-sky-400/20 bg-sky-500/10 p-2">
                        <FileStack className="h-5 w-5 text-sky-600" aria-hidden />
                    </div>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-xs font-semibold text-slate-800">
                                Lote {resumen.lote}
                            </span>
                            <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                                ID {resumen.id_resumen}
                            </span>
                        </div>
                        <p className="mt-1 text-sm font-medium text-slate-900">
                            {getTitleCase(resumen.usuario || "Sin usuario")}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-600">
                            {resumen.cantidad} comprobante{resumen.cantidad === 1 ? "" : "s"}
                        </p>
                    </div>
                </div>
                <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                    <SunatBadge
                        ok={resumen.enviada_sunat}
                        label={resumen.enviada_sunat ? "Enviada SUNAT" : "Pendiente envío"}
                    />
                    <SunatBadge
                        ok={resumen.aceptada_sunat}
                        label={resumen.aceptada_sunat ? "Aceptada SUNAT" : "Pendiente aceptación"}
                    />
                </div>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-slate-100 pt-3 text-[11px] sm:grid-cols-4">
                <div>
                    <dt className="text-slate-500">Fecha resumen</dt>
                    <dd className="font-medium text-slate-800">
                        {formatLocalDate(resumen.fecha_resumen)}
                    </dd>
                </div>
                <div>
                    <dt className="text-slate-500">Fecha emisión</dt>
                    <dd className="font-medium text-slate-800">
                        {formatLocalDate(resumen.fecha_emision)}
                    </dd>
                </div>
                <div>
                    <dt className="text-slate-500">Ticket SUNAT</dt>
                    <dd className="font-medium text-slate-800">
                        {displayValue(resumen.ticket_sunat)}
                    </dd>
                </div>
                <div>
                    <dt className="text-slate-500">Denominación</dt>
                    <dd className="font-medium text-slate-800">
                        {displayValue(resumen.denominacion)}
                    </dd>
                </div>
            </dl>
        </div>
    </article>
)

export default ResumenCard
