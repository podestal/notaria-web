import type { LucideIcon, ReactNode } from "react"
import { ArrowLeftRight, Ban, ClipboardList, FileText, Printer, Receipt } from "lucide-react"
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

interface TypeVisual {
    label: string
    Icon: LucideIcon
    borderClass: string
    headerClass: string
    badgeClass: string
    iconClass: string
}

const getTypeVisual = (
    variant: ComprobanteVariant,
    comprobanteId?: number,
): TypeVisual => {
    if (variant === "ingreso") {
        return {
            label: "Control interno",
            Icon: ClipboardList,
            borderClass: "border-indigo-200",
            headerClass: "bg-indigo-50",
            badgeClass: "bg-indigo-600 text-white",
            iconClass: "bg-indigo-100 text-indigo-700",
        }
    }

    if (comprobanteId === RECIBO_COMPROBANTE_FACTURA) {
        return {
            label: "Factura",
            Icon: FileText,
            borderClass: "border-sky-200",
            headerClass: "bg-sky-50",
            badgeClass: "bg-sky-600 text-white",
            iconClass: "bg-sky-100 text-sky-700",
        }
    }

    if (comprobanteId === RECIBO_COMPROBANTE_BOLETA) {
        return {
            label: "Boleta",
            Icon: Receipt,
            borderClass: "border-emerald-200",
            headerClass: "bg-emerald-50",
            badgeClass: "bg-emerald-600 text-white",
            iconClass: "bg-emerald-100 text-emerald-700",
        }
    }

    return {
        label: RECIBO_TIPO_LABELS[comprobanteId ?? 0] ?? "Recibo",
        Icon: Receipt,
        borderClass: "border-slate-200",
        headerClass: "bg-slate-50",
        badgeClass: "bg-slate-600 text-white",
        iconClass: "bg-slate-100 text-slate-700",
    }
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
            className={`inline-flex items-center gap-1 rounded-md border bg-white px-2.5 py-1.5 text-[11px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${toneClasses[tone]}`}
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
    const typeVisual = getTypeVisual(variant, recibo?.comprobante)
    const TypeIcon = typeVisual.Icon
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
            className={`overflow-hidden rounded-xl border-2 bg-white shadow-sm ${
                item.anulada
                    ? "border-red-200 opacity-90"
                    : typeVisual.borderClass
            }`}
        >
            <div
                className={`flex items-center justify-between gap-3 px-3 py-2 ${typeVisual.headerClass}`}
            >
                <div className="flex min-w-0 items-center gap-2.5">
                    <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${typeVisual.iconClass}`}
                    >
                        <TypeIcon className="h-4 w-4" aria-hidden />
                    </span>
                    <div className="min-w-0">
                        <span
                            className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${typeVisual.badgeClass}`}
                        >
                            {typeVisual.label}
                        </span>
                        <p className="mt-0.5 font-mono text-sm font-bold text-slate-900">
                            {comprobante}
                        </p>
                    </div>
                </div>

                <div className="shrink-0 text-right">
                    <p className="text-base font-bold text-slate-900">
                        {formatAmount(item.total, item.moneda)}
                    </p>
                    <p className="text-[10px] font-medium text-slate-500">{item.moneda}</p>
                </div>
            </div>

            <div className="px-3 py-2.5">
                <div className="flex flex-wrap items-center gap-1.5">
                    {item.anulada && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase text-red-700">
                            Anulada
                        </span>
                    )}
                    {ingreso?.canjeada && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
                            Canjeada
                        </span>
                    )}
                    {recibo &&
                        item.anulada &&
                        recibo.comprobante === RECIBO_COMPROBANTE_BOLETA &&
                        recibo.resumen_id == null && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-800">
                                Pend. resumen
                            </span>
                        )}
                </div>

                <p className="mt-1.5 truncate text-sm font-semibold text-slate-900">
                    {getTitleCase(personaDisplayName)}
                </p>
                <p className="text-xs text-slate-500">
                    {formatLocalDate(item.fecha_emision)}
                    {item.usuario ? ` · ${getTitleCase(item.usuario)}` : ""}
                </p>

                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-2.5">
                    <CompactAction
                        label="Imprimir"
                        icon={<Printer className="h-3.5 w-3.5" aria-hidden />}
                        onClick={() => onImprimir?.(item)}
                    />
                    {onAnular && (
                        <CompactAction
                            label="Anular"
                            icon={<Ban className="h-3.5 w-3.5" aria-hidden />}
                            onClick={() => onAnular(item)}
                            disabled={!canAnular}
                            tone="danger"
                        />
                    )}
                    {variant === "ingreso" && onCanjear && (
                        <CompactAction
                            label="Canjear"
                            icon={<ArrowLeftRight className="h-3.5 w-3.5" aria-hidden />}
                            onClick={() => onCanjear(item)}
                            disabled={!canCanjear}
                            tone="success"
                        />
                    )}
                </div>
            </div>
        </article>
    )
}

export default KardexComprobanteCard
