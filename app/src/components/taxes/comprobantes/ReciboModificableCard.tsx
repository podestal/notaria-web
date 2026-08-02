import { FileText, Receipt } from "lucide-react"
import type { Recibo } from "../../../services/taxes/recibosService"
import {
    RECIBO_COMPROBANTE_BOLETA,
    RECIBO_COMPROBANTE_FACTURA,
} from "../../../services/taxes/recibosService"
import { formatLocalDate } from "../../../utils/formatLocalDate"
import getTitleCase from "../../../utils/getTitleCase"
import TopModal from "../../ui/TopModal"
import CreateNotaFromRecibo from "./CreateNotaFromRecibo"
import type { EmisionFormVariant } from "./comprobanteFormConfig"

type NotaVariant = Extract<EmisionFormVariant, "nota_credito" | "nota_debito">

const formatAmount = (value: string, moneda: string) => {
    const n = Number(value)
    const prefix = moneda === "SOLES" ? "S/ " : moneda === "DOLARES" ? "$ " : ""
    if (Number.isNaN(n)) return `${prefix}${value || "—"}`
    return `${prefix}${n.toLocaleString("es-PE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`
}

const comprobanteLabel = (comprobante: number) => {
    if (comprobante === RECIBO_COMPROBANTE_FACTURA) return "Factura"
    if (comprobante === RECIBO_COMPROBANTE_BOLETA) return "Boleta"
    return `Tipo ${comprobante}`
}

const accentByComprobante = (comprobante: number) => {
    if (comprobante === RECIBO_COMPROBANTE_FACTURA) {
        return {
            bar: "bg-sky-500",
            iconWrap: "border-sky-200 bg-sky-50 text-sky-700",
            badge: "bg-sky-50 text-sky-800 ring-sky-200",
        }
    }
    if (comprobante === RECIBO_COMPROBANTE_BOLETA) {
        return {
            bar: "bg-emerald-500",
            iconWrap: "border-emerald-200 bg-emerald-50 text-emerald-700",
            badge: "bg-emerald-50 text-emerald-800 ring-emerald-200",
        }
    }
    return {
        bar: "bg-slate-400",
        iconWrap: "border-slate-200 bg-slate-50 text-slate-600",
        badge: "bg-slate-100 text-slate-700 ring-slate-200",
    }
}

interface Props {
    recibo: Recibo
    openVariant: NotaVariant | null
    onOpenVariant: (variant: NotaVariant | null) => void
    onCreated?: () => void
    preferredVariant?: NotaVariant
}

const ReciboModificableCard = ({
    recibo,
    openVariant,
    onOpenVariant,
    onCreated,
    preferredVariant,
}: Props) => {
    const isNcOpen = openVariant === "nota_credito"
    const isNdOpen = openVariant === "nota_debito"
    const accent = accentByComprobante(recibo.comprobante)
    const showNc = !preferredVariant || preferredVariant === "nota_credito"
    const showNd = !preferredVariant || preferredVariant === "nota_debito"

    return (
        <>
            <article className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                <div className={`absolute inset-y-0 left-0 w-1 ${accent.bar}`} aria-hidden />

                <div className="flex flex-col gap-4 p-4 pl-5 sm:flex-row sm:items-stretch sm:justify-between">
                    <div className="flex min-w-0 flex-1 gap-3">
                        <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${accent.iconWrap}`}
                        >
                            <Receipt className="h-5 w-5" aria-hidden />
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <span
                                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${accent.badge}`}
                                >
                                    {comprobanteLabel(recibo.comprobante)}
                                </span>
                                <span className="font-mono text-sm font-semibold text-slate-900">
                                    {recibo.serie}-{recibo.numero}
                                </span>
                                {recibo.aceptada_sunat ? (
                                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                                        SUNAT OK
                                    </span>
                                ) : (
                                    <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-500 ring-1 ring-slate-200">
                                        SUNAT pendiente
                                    </span>
                                )}
                            </div>

                            <h3 className="mt-1.5 truncate text-sm font-semibold text-slate-900">
                                {getTitleCase(recibo.persona_nombres || "Sin cliente")}
                            </h3>
                            <p className="mt-0.5 font-mono text-xs text-slate-500">
                                {recibo.persona_documento || "—"}
                            </p>

                            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-slate-100 pt-3 text-[11px] sm:grid-cols-3">
                                <div>
                                    <dt className="text-slate-400">Emisión</dt>
                                    <dd className="font-medium text-slate-800">
                                        {formatLocalDate(recibo.fecha_emision) || "—"}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-slate-400">Kardex</dt>
                                    <dd className="font-mono font-semibold text-sky-800">
                                        {recibo.kardex || "—"}
                                    </dd>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <dt className="text-slate-400">Usuario</dt>
                                    <dd className="truncate font-medium text-slate-800">
                                        {getTitleCase(recibo.usuario || "—")}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-col justify-between gap-3 border-t border-slate-100 pt-3 sm:w-40 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
                        <div className="text-right">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                Total
                            </p>
                            <p className="mt-0.5 font-mono text-lg font-semibold leading-none text-slate-900">
                                {formatAmount(recibo.total, recibo.moneda)}
                            </p>
                            <p className="mt-1 text-[10px] text-slate-400">{recibo.moneda}</p>
                        </div>

                        <div className="flex gap-2 sm:flex-col">
                            {showNc && (
                                <button
                                    type="button"
                                    onClick={() => onOpenVariant("nota_credito")}
                                    className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                                        isNcOpen
                                            ? "bg-rose-600 text-white shadow-sm"
                                            : "border border-rose-200 bg-rose-50 text-rose-800 hover:border-rose-300 hover:bg-rose-100"
                                    }`}
                                >
                                    <FileText className="h-3.5 w-3.5" aria-hidden />
                                     Nota de crédito
                                </button>
                            )}
                            {showNd && (
                                <button
                                    type="button"
                                    onClick={() => onOpenVariant("nota_debito")}
                                    className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                                        isNdOpen
                                            ? "bg-teal-600 text-white shadow-sm"
                                            : "border border-teal-200 bg-teal-50 text-teal-800 hover:border-teal-300 hover:bg-teal-100"
                                    }`}
                                >
                                    <FileText className="h-3.5 w-3.5" aria-hidden />
                                    Nota de débito
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </article>

            <TopModal
                isOpen={Boolean(openVariant)}
                onClose={() => onOpenVariant(null)}
                portal
                wide
                deepth={60}
            >
                {openVariant && (
                    <CreateNotaFromRecibo
                        key={`${recibo.id_recibo}-${openVariant}`}
                        recibo={recibo}
                        variant={openVariant}
                        onClose={() => onOpenVariant(null)}
                        onDone={onCreated}
                    />
                )}
            </TopModal>
        </>
    )
}

export default ReciboModificableCard
