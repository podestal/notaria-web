import { FileStack, RefreshCw } from "lucide-react"
import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import useConsultarResumenTicket from "../../../hooks/taxes/resumenes/useConsultarResumenTicket"
import type { Resumen } from "../../../services/taxes/resumenesService"
import {
    getResumenSunatLabel,
    getSunatDetailMessage,
    inferSunatDisplayFromResumen,
} from "../../../services/taxes/sunatStatus"
import getTitleCase from "../../../utils/getTitleCase"
import { formatLocalDate } from "../../../utils/formatLocalDate"
import { getIngresoBackendError } from "../controlInterno/ingresoFormShared"

interface Props {
    resumen: Resumen
}

const displayValue = (value: string | null | undefined) => {
    if (!value || value === "-") return "—"
    return value
}

const SunatBadge = ({
    label,
    tone,
}: {
    label: string
    tone: "success" | "warning" | "danger"
}) => {
    const toneClasses = {
        success: "bg-emerald-100 text-emerald-700",
        warning: "bg-amber-100 text-amber-800",
        danger: "bg-red-100 text-red-800",
    }

    return (
        <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${toneClasses[tone]}`}
        >
            {label}
        </span>
    )
}

const ResumenCard = ({ resumen }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { setMessage, setShow, setType } = useNotificationsStore()
    const consultarTicket = useConsultarResumenTicket({ id_resumen: resumen.id_resumen })

    const sunatDisplay = inferSunatDisplayFromResumen(resumen)
    const sunatDetail = getSunatDetailMessage(null, resumen)
    const ticketPendiente = sunatDisplay === "ticket_pending"
    const sunatBadgeTone =
        sunatDisplay === "accepted"
            ? "success"
            : sunatDisplay === "rejected"
              ? "danger"
              : "warning"

    const handleConsultarTicket = async () => {
        try {
            await consultarTicket.mutateAsync({ access })
            setMessage("Consulta de ticket SUNAT realizada")
            setType("success")
            setShow(true)
        } catch (err) {
            setMessage(getIngresoBackendError(err))
            setType("error")
            setShow(true)
        }
    }

    return (
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
                                    {displayValue(resumen.denominacion) !== "—"
                                        ? resumen.denominacion
                                        : `Lote ${resumen.lote}`}
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
                        {sunatDisplay && (
                            <SunatBadge
                                label={getResumenSunatLabel(sunatDisplay)}
                                tone={sunatBadgeTone}
                            />
                        )}
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
                        <dt className="text-slate-500">Lote</dt>
                        <dd className="font-medium text-slate-800">{resumen.lote}</dd>
                    </div>
                </dl>

                {sunatDetail && sunatDisplay === "rejected" && (
                    <p className="mt-2 rounded-md border border-red-200 bg-red-50 px-2.5 py-2 text-[11px] text-red-800">
                        {sunatDetail}
                    </p>
                )}

                {sunatDisplay === "sunat_down" && (
                    <p className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-2 text-[11px] text-amber-900">
                        SUNAT no disponible. El resumen fue generado; el sistema reintentará el
                        envío automáticamente.
                    </p>
                )}

                {ticketPendiente && (
                    <div className="mt-3 flex justify-end border-t border-slate-100 pt-3">
                        <button
                            type="button"
                            onClick={handleConsultarTicket}
                            disabled={consultarTicket.isPending}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-100 disabled:opacity-60"
                        >
                            <RefreshCw
                                className={`h-3.5 w-3.5 ${consultarTicket.isPending ? "animate-spin" : ""}`}
                                aria-hidden
                            />
                            {consultarTicket.isPending
                                ? "Consultando ticket…"
                                : "Consultar ticket SUNAT"}
                        </button>
                    </div>
                )}
            </div>
        </article>
    )
}

export default ResumenCard
