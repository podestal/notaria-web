import { Receipt } from "lucide-react"
import type { Ingreso } from "../../../services/taxes/ingresosService"
import getTitleCase from "../../../utils/getTitleCase"
import { formatLocalDate } from "../../../utils/formatLocalDate"

interface Props {
    ingreso: Ingreso
    onEdit?: (ingreso: Ingreso) => void
}

const formatDateTime = (iso: string | null) => {
    if (!iso) return "—"
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleString("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}

const formatAmount = (value: string, moneda: string) => {
    const n = Number(value)
    const prefix = moneda === "SOLES" ? "S/ " : ""
    if (Number.isNaN(n)) return `${prefix}${value || "—"}`
    return `${prefix}${n.toLocaleString("es-PE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`
}

const displayValue = (value: string | null | undefined) => {
    if (!value || value === "-") return "—"
    return value
}

const IngresoCard = ({ ingreso, onEdit }: Props) => {
    const comprobante = `${ingreso.serie || "—"}-${ingreso.numero ?? "—"}`

    return (
        <article
            className={`rounded-lg border bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md ${
                ingreso.anulada ? "border-red-200" : "border-slate-200"
            }`}
        >
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 gap-3">
                    <div className="rounded-xl border border-sky-400/20 bg-sky-500/10 p-2">
                        <Receipt className="h-5 w-5 text-sky-600" aria-hidden />
                    </div>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold text-slate-800">
                                {comprobante}
                            </span>
                            {ingreso.anulada && (
                                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-700">
                                    Anulada
                                </span>
                            )}
                            {ingreso.canjeada && (
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                                    Canjeada
                                </span>
                            )}
                        </div>
                        <h3 className="mt-1 text-sm font-medium leading-snug text-slate-900">
                            {getTitleCase(ingreso.persona_nombres || "Sin nombre")}
                        </h3>
                        <p className="mt-0.5 font-mono text-xs text-slate-600">
                            {ingreso.persona_documento || "—"}
                        </p>
                    </div>
                </div>
                <div className="shrink-0 text-right text-xs">
                    <div>
                        <p className="text-slate-500">Total</p>
                        <p className="text-base font-semibold text-slate-900">
                            {formatAmount(ingreso.total, ingreso.moneda)}
                        </p>
                        <p className="text-[10px] text-slate-400">{ingreso.moneda}</p>
                    </div>
                    {onEdit && (
                        <button
                            type="button"
                            onClick={() => onEdit(ingreso)}
                            className="mt-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Editar
                        </button>
                    )}
                </div>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 border-t border-slate-100 pt-3 text-[11px] sm:grid-cols-4">
                <div>
                    <dt className="text-slate-500">Emisión</dt>
                    <dd className="font-medium text-slate-800">
                        {formatDateTime(ingreso.fecha_emision)}
                    </dd>
                </div>
                <div>
                    <dt className="text-slate-500">Usuario</dt>
                    <dd className="font-medium text-slate-800">
                        {getTitleCase(displayValue(ingreso.usuario))}
                    </dd>
                </div>
                <div>
                    <dt className="text-slate-500">Dirección</dt>
                    <dd className="font-medium text-slate-800">
                        {getTitleCase(displayValue(ingreso.direccion))}
                    </dd>
                </div>
                <div>
                    <dt className="text-slate-500">Observaciones</dt>
                    <dd className="font-medium text-slate-800">
                        {displayValue(ingreso.observaciones)}
                    </dd>
                </div>
                {ingreso.anulada && (
                    <>
                        <div>
                            <dt className="text-slate-500">Motivo baja</dt>
                            <dd className="font-medium text-red-700">
                                {displayValue(ingreso.motivo_baja)}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-slate-500">Fecha baja</dt>
                            <dd className="font-medium text-slate-800">
                                {formatLocalDate(ingreso.fecha_baja)}
                            </dd>
                        </div>
                    </>
                )}
            </dl>
        </article>
    )
}

export default IngresoCard
