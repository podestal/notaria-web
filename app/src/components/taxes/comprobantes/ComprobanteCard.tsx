import type { ReactNode } from "react"
import { ArrowLeftRight, Ban, Printer, Receipt } from "lucide-react"
import getTitleCase from "../../../utils/getTitleCase"
import { formatLocalDate } from "../../../utils/formatLocalDate"
import {
    type ComprobanteItem,
    type ComprobanteVariant,
    getComprobanteSerieNumero,
    isIngreso,
    isRecibo,
} from "./comprobanteTypes"
import { RECIBO_COMPROBANTE_BOLETA } from "../../../services/taxes/recibosService"

interface Props {
    variant: ComprobanteVariant
    item: ComprobanteItem
    onEdit?: (item: ComprobanteItem) => void
    onImprimir?: (item: ComprobanteItem) => void
    onAnular?: (item: ComprobanteItem) => void
    onCanjear?: (item: ComprobanteItem) => void
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

interface ActionButtonProps {
    label: string
    icon: ReactNode
    onClick?: () => void
    disabled?: boolean
    tone?: "default" | "danger" | "success"
}

const ActionButton = ({
    label,
    icon,
    onClick,
    disabled = false,
    tone = "default",
}: ActionButtonProps) => {
    const toneClasses = {
        default:
            "text-slate-600 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700",
        danger:
            "text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700",
        success:
            "text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700",
    }

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg border border-transparent px-2 py-2 transition disabled:cursor-not-allowed disabled:opacity-40 ${toneClasses[tone]}`}
        >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
                {icon}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wide">
                {label}
            </span>
        </button>
    )
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

const ComprobanteCard = ({
    variant,
    item,
    onEdit,
    onImprimir,
    onAnular,
    onCanjear,
}: Props) => {
    const comprobante = getComprobanteSerieNumero(item)
    const canAnular = !item.anulada
    const showCanjear = variant === "ingreso" && Boolean(onCanjear)
    const ingreso = isIngreso(item) ? item : null
    const recibo = isRecibo(item) ? item : null
    const canCanjear =
        showCanjear && ingreso != null && !ingreso.anulada && !ingreso.canjeada

    return (
        <article
            className={`overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md ${
                item.anulada ? "border-red-200" : "border-slate-200"
            }`}
        >
            <div className="px-4 py-3">
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
                                {item.anulada && (
                                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-700">
                                        Anulada
                                    </span>
                                )}
                                {item.anulada &&
                                    recibo &&
                                    recibo.comprobante === RECIBO_COMPROBANTE_BOLETA &&
                                    recibo.resumen_id == null && (
                                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
                                        Pend. resumen
                                    </span>
                                )}
                                {ingreso?.canjeada && (
                                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                                        Canjeada
                                    </span>
                                )}
                                {recibo && !recibo.anulada && (
                                    <>
                                        <SunatBadge
                                            ok={recibo.enviada_sunat}
                                            label={
                                                recibo.enviada_sunat
                                                    ? "Enviada SUNAT"
                                                    : "Pend. SUNAT"
                                            }
                                        />
                                        <SunatBadge
                                            ok={recibo.aceptada_sunat}
                                            label={
                                                recibo.aceptada_sunat
                                                    ? "Aceptada"
                                                    : "No aceptada"
                                            }
                                        />
                                    </>
                                )}
                            </div>
                            <h3 className="mt-1 text-sm font-medium leading-snug text-slate-900">
                                {getTitleCase(item.persona_nombres || "Sin nombre")}
                            </h3>
                            <p className="mt-0.5 font-mono text-xs text-slate-600">
                                {item.persona_documento || "—"}
                            </p>
                        </div>
                    </div>
                    <div className="shrink-0 text-right text-xs">
                        <p className="text-slate-500">Total</p>
                        <p className="text-base font-semibold text-slate-900">
                            {formatAmount(item.total, item.moneda)}
                        </p>
                        <p className="text-[10px] text-slate-400">{item.moneda}</p>
                        {onEdit && (
                            <button
                                type="button"
                                onClick={() => onEdit(item)}
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
                            {formatLocalDate(item.fecha_emision)}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-slate-500">Usuario</dt>
                        <dd className="font-medium text-slate-800">
                            {getTitleCase(displayValue(item.usuario))}
                        </dd>
                    </div>
                    {recibo && (
                        <>
                            <div>
                                <dt className="text-slate-500">Gravada</dt>
                                <dd className="font-medium text-slate-800">
                                    {formatAmount(recibo.gravada, recibo.moneda)}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">IGV</dt>
                                <dd className="font-medium text-slate-800">
                                    {formatAmount(recibo.igv, recibo.moneda)}
                                </dd>
                            </div>
                        </>
                    )}
                    {ingreso && (
                        <>
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
                        </>
                    )}
                    {ingreso?.anulada && (
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
                    {recibo?.anulada && (
                        <>
                            <div>
                                <dt className="text-slate-500">Motivo baja</dt>
                                <dd className="font-medium text-red-700">
                                    {displayValue(recibo.motivo_baja)}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Fecha baja</dt>
                                <dd className="font-medium text-slate-800">
                                    {formatLocalDate(recibo.fecha_baja)}
                                </dd>
                            </div>
                        </>
                    )}
                </dl>
            </div>

            <div
                className={`grid gap-1 border-t border-slate-100 bg-slate-50/80 px-2 py-2 ${
                    showCanjear ? "grid-cols-3" : "grid-cols-2"
                }`}
            >
                <ActionButton
                    label="Imprimir"
                    icon={<Printer className="h-4 w-4" aria-hidden />}
                    onClick={() => onImprimir?.(item)}
                />
                <ActionButton
                    label="Anular"
                    icon={<Ban className="h-4 w-4" aria-hidden />}
                    onClick={() => onAnular?.(item)}
                    disabled={!canAnular}
                    tone="danger"
                />
                {showCanjear && (
                    <ActionButton
                        label="Canjear"
                        icon={<ArrowLeftRight className="h-4 w-4" aria-hidden />}
                        onClick={() => onCanjear?.(item)}
                        disabled={!canCanjear}
                        tone="success"
                    />
                )}
            </div>
        </article>
    )
}

export default ComprobanteCard
