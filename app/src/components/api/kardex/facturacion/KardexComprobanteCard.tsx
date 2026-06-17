import type { ReactNode } from "react"
import { ArrowLeftRight, Ban, Printer } from "lucide-react"
import useAuthStore from "../../../../store/useAuthStore"
import useLookupPersonas from "../../../../hooks/taxes/personas/useLookupPersonas"
import {
    RECIBO_COMPROBANTE_BOLETA,
    RECIBO_COMPROBANTE_FACTURA,
    RECIBO_COMPROBANTE_NOTA_CREDITO,
    RECIBO_COMPROBANTE_NOTA_DEBITO,
} from "../../../../services/taxes/recibosService"
import getTitleCase from "../../../../utils/getTitleCase"
import { formatLocalDate } from "../../../../utils/formatLocalDate"
import {
    type ComprobanteItem,
    type ComprobanteVariant,
    getComprobanteSerieNumero,
    isIngreso,
    isRecibo,
} from "../../../taxes/comprobantes/comprobanteTypes"

interface Props {
    variant: ComprobanteVariant
    item: ComprobanteItem
    onImprimir?: (item: ComprobanteItem) => void
    onAnular?: (item: ComprobanteItem) => void
    onCanjear?: (item: ComprobanteItem) => void
}

const RECIBO_TIPO_LABELS: Record<number, string> = {
    [RECIBO_COMPROBANTE_FACTURA]: "Factura",
    [RECIBO_COMPROBANTE_BOLETA]: "Boleta",
    [RECIBO_COMPROBANTE_NOTA_CREDITO]: "Nota de crédito",
    [RECIBO_COMPROBANTE_NOTA_DEBITO]: "Nota de débito",
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

const isPlaceholderPersonaName = (value: string | null | undefined) => {
    const normalized = (value || "")
        .trim()
        .replace(/\s+/g, " ")
        .toUpperCase()

    return !normalized || normalized === "0" || normalized === "0 0 0"
}

const getPersonaDisplayName = (
    fallbackName: string | null | undefined,
    resolvedName: string | null | undefined,
) => {
    if (!isPlaceholderPersonaName(fallbackName)) return fallbackName || "Sin nombre"
    if (!isPlaceholderPersonaName(resolvedName)) return resolvedName || "Sin nombre"
    return "Sin nombre"
}

interface CompactActionProps {
    label: string
    icon: ReactNode
    onClick?: () => void
    disabled?: boolean
    tone?: "default" | "danger" | "success"
}

const CompactAction = ({
    label,
    icon,
    onClick,
    disabled = false,
    tone = "default",
}: CompactActionProps) => {
    const toneClasses = {
        default: "border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-sky-700",
        danger: "border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-700",
        success:
            "border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700",
    }

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={label}
            className={`inline-flex items-center gap-1 rounded-md border bg-white px-2 py-1 text-[10px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${toneClasses[tone]}`}
        >
            {icon}
            <span>{label}</span>
        </button>
    )
}

const KardexComprobanteCard = ({
    variant,
    item,
    onImprimir,
    onAnular,
    onCanjear,
}: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const comprobante = getComprobanteSerieNumero(item)
    const ingreso = isIngreso(item) ? item : null
    const recibo = isRecibo(item) ? item : null
    const tipoLabel =
        variant === "ingreso"
            ? "Control interno"
            : RECIBO_TIPO_LABELS[recibo?.comprobante ?? 0] ?? "Recibo"
    const canAnular = !item.anulada && Boolean(onAnular)
    const canCanjear =
        variant === "ingreso" &&
        Boolean(onCanjear) &&
        ingreso != null &&
        !ingreso.anulada &&
        !ingreso.canjeada

    const shouldResolvePersonaName = isPlaceholderPersonaName(item.persona_nombres)
    const { data: personaMatches = [] } = useLookupPersonas({
        access,
        q: item.persona_documento || "",
        enabled: shouldResolvePersonaName && Boolean(item.persona_documento),
    })
    const resolvedPersona = personaMatches.find(
        (persona) => persona.numero_documento === item.persona_documento,
    )
    const resolvedPersonaName =
        resolvedPersona?.razon_social && resolvedPersona.razon_social !== "0"
            ? resolvedPersona.razon_social
            : resolvedPersona?.nombre_completo
    const personaDisplayName = getPersonaDisplayName(
        item.persona_nombres,
        resolvedPersonaName,
    )

    return (
        <article
            className={`rounded-lg border bg-white px-3 py-2.5 shadow-sm ${
                item.anulada ? "border-red-200 bg-red-50/30" : "border-slate-200"
            }`}
        >
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-mono text-xs font-semibold text-slate-800">
                            {comprobante}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                            {tipoLabel}
                        </span>
                        {item.anulada && (
                            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-red-700">
                                Anulada
                            </span>
                        )}
                        {ingreso?.canjeada && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-700">
                                Canjeada
                            </span>
                        )}
                        {recibo &&
                            item.anulada &&
                            recibo.comprobante === RECIBO_COMPROBANTE_BOLETA &&
                            recibo.resumen_id == null && (
                                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-800">
                                    Pend. resumen
                                </span>
                            )}
                    </div>
                    <p className="mt-1 truncate text-sm font-medium text-slate-900">
                        {getTitleCase(personaDisplayName)}
                    </p>
                    <p className="text-[11px] text-slate-500">
                        {formatLocalDate(item.fecha_emision)}
                        {item.usuario ? ` · ${getTitleCase(item.usuario)}` : ""}
                    </p>
                </div>

                <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-slate-900">
                        {formatAmount(item.total, item.moneda)}
                    </p>
                    <p className="text-[10px] text-slate-400">{item.moneda}</p>
                </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-1 border-t border-slate-100 pt-2">
                <CompactAction
                    label="Imprimir"
                    icon={<Printer className="h-3 w-3" aria-hidden />}
                    onClick={() => onImprimir?.(item)}
                />
                {onAnular && (
                    <CompactAction
                        label="Anular"
                        icon={<Ban className="h-3 w-3" aria-hidden />}
                        onClick={() => onAnular(item)}
                        disabled={!canAnular}
                        tone="danger"
                    />
                )}
                {variant === "ingreso" && onCanjear && (
                    <CompactAction
                        label="Canjear"
                        icon={<ArrowLeftRight className="h-3 w-3" aria-hidden />}
                        onClick={() => onCanjear(item)}
                        disabled={!canCanjear}
                        tone="success"
                    />
                )}
            </div>
        </article>
    )
}

export default KardexComprobanteCard
