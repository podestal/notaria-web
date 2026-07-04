import type { ReactNode } from "react"
import { ArrowLeftRight, Ban, Printer, Receipt, RefreshCw } from "lucide-react"
import useAuthStore from "../../../store/useAuthStore"
import useLookupPersonas from "../../../hooks/taxes/personas/useLookupPersonas"
import useEnviarReciboSunat from "../../../hooks/taxes/recibos/useEnviarReciboSunat"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import getTitleCase from "../../../utils/getTitleCase"
import { formatLocalDate } from "../../../utils/formatLocalDate"
import {
    type ComprobanteItem,
    type ComprobanteVariant,
    getComprobanteSerieNumero,
    isIngreso,
    isRecibo,
} from "./comprobanteTypes"
import {
    RECIBO_COMPROBANTE_BOLETA,
    type Recibo,
} from "../../../services/taxes/recibosService"
import {
    getSunatDetailMessage,
    getSunatNotification,
    inferSunatStatusFromRecibo,
    reciboUsesDirectSunat,
} from "../../../services/taxes/sunatStatus"
import SunatStatusBadge from "../sunat/SunatStatusBadge"
import { getIngresoBackendError } from "../controlInterno/ingresoFormShared"

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

const ComprobanteSunatRetry = ({ recibo }: { recibo: Recibo }) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { setMessage, setShow, setType } = useNotificationsStore()
    const enviarSunat = useEnviarReciboSunat({ id_recibo: recibo.id_recibo })

    const handleRetry = async () => {
        try {
            const response = await enviarSunat.mutateAsync({ access })
            const notification = getSunatNotification(
                response,
                "Reenvío a SUNAT procesado.",
            )
            setMessage(notification.message)
            setType(notification.type)
            setShow(true)
        } catch (error) {
            setMessage(getIngresoBackendError(error))
            setType("error")
            setShow(true)
        }
    }

    return (
        <button
            type="button"
            onClick={handleRetry}
            disabled={enviarSunat.isPending}
            className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-60"
        >
            <RefreshCw
                className={`h-3 w-3 ${enviarSunat.isPending ? "animate-spin" : ""}`}
                aria-hidden
            />
            {enviarSunat.isPending ? "Enviando…" : "Reenviar a SUNAT"}
        </button>
    )
}

const ComprobanteCard = ({
    variant,
    item,
    onEdit,
    onImprimir,
    onAnular,
    onCanjear,
}: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const comprobante = getComprobanteSerieNumero(item)
    const canAnular = !item.anulada && Boolean(onAnular)
    const showAnular = Boolean(onAnular)
    const showCanjear = variant === "ingreso" && Boolean(onCanjear)
    const ingreso = isIngreso(item) ? item : null
    const recibo = isRecibo(item) ? item : null
    const canCanjear =
        showCanjear && ingreso != null && !ingreso.anulada && !ingreso.canjeada
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
    const sunatStatus =
        recibo && reciboUsesDirectSunat(recibo.comprobante)
            ? inferSunatStatusFromRecibo(recibo)
            : null
    const sunatDetail =
        recibo && sunatStatus === "rejected"
            ? getSunatDetailMessage(null, recibo)
            : null
    const showSunatRetry =
        recibo
        && !recibo.anulada
        && reciboUsesDirectSunat(recibo.comprobante)
        && !recibo.aceptada_sunat

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
                                {recibo && reciboUsesDirectSunat(recibo.comprobante) && sunatStatus && (
                                    <SunatStatusBadge status={sunatStatus} compact />
                                )}
                                {recibo && showSunatRetry && (
                                    <ComprobanteSunatRetry recibo={recibo} />
                                )}
                            </div>
                            <h3 className="mt-1 text-sm font-medium leading-snug text-slate-900">
                                {getTitleCase(personaDisplayName)}
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
                    {item.kardex && (
                        <div>
                            <dt className="text-slate-500">Kardex</dt>
                            <dd className="font-mono font-semibold text-sky-800">
                                {item.kardex}
                            </dd>
                        </div>
                    )}
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

                {sunatDetail && (
                    <p className="mt-2 rounded-md border border-red-200 bg-red-50 px-2.5 py-2 text-[11px] text-red-800">
                        {sunatDetail}
                    </p>
                )}
            </div>

            <div
                className={`grid gap-1 border-t border-slate-100 bg-slate-50/80 px-2 py-2 ${
                    showCanjear
                        ? "grid-cols-3"
                        : showAnular
                          ? "grid-cols-2"
                          : "grid-cols-1"
                }`}
            >
                <ActionButton
                    label="Imprimir"
                    icon={<Printer className="h-4 w-4" aria-hidden />}
                    onClick={() => onImprimir?.(item)}
                />
                {showAnular && (
                    <ActionButton
                        label="Anular"
                        icon={<Ban className="h-4 w-4" aria-hidden />}
                        onClick={() => onAnular?.(item)}
                        disabled={!canAnular}
                        tone="danger"
                    />
                )}
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
