import { useEffect, useState } from "react"
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import useGetComplianceMeKardex from "../../../../hooks/compliance/useGetComplianceMeKardex"
import useAuthStore from "../../../../store/useAuthStore"
import ComplianceMeKardexModal from "./ComplianceMeKardexModal"

const MONTH_LABELS = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
]

const ComplianceMeReminder = () => {
    const access = useAuthStore((s) => s.access_token) || ""
    const [modalOpen, setModalOpen] = useState(false)
    const { pathname } = useLocation()

    useEffect(() => {
        setModalOpen(false)
    }, [pathname])

    const { data, isLoading, isError, refetch, isFetching } = useGetComplianceMeKardex({
        access,
        enabled: Boolean(access),
    })

    const periodFromData = data
        ? `${MONTH_LABELS[data.month - 1] ?? data.month} ${data.year}`
        : null

    const now = new Date()
    const periodFallback = `${MONTH_LABELS[now.getMonth()]} ${now.getFullYear()}`
    const periodLabel = periodFromData ?? periodFallback

    const hasErrors =
        data != null && (data.kardex_with_errors > 0 || data.counts.total > 0)

    if (!access) {
        return (
            <div className="mb-3 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2.5">
                <p className="text-[10px] text-slate-400">Cumplimiento del mes</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{periodLabel}</p>
            </div>
        )
    }

    if (isLoading && !data) {
        return (
            <div className="mb-3 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2.5">
                <div className="flex items-center gap-2 text-slate-400">
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
                    <p className="text-[11px]">Revisando errores…</p>
                </div>
                <p className="mt-1 text-[10px] text-slate-500">{periodLabel}</p>
            </div>
        )
    }

    if (isError && !data) {
        return (
            <div className="mb-3 rounded-lg border border-slate-600 bg-slate-900/80 px-3 py-2.5">
                <p className="text-[11px] font-semibold text-slate-200">
                    Errores del mes
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">{periodLabel}</p>
                <button
                    type="button"
                    onClick={() => refetch()}
                    className="mt-2 text-[10px] font-semibold text-sky-400 hover:text-sky-300"
                >
                    Reintentar
                </button>
            </div>
        )
    }

    return (
        <>
            {hasErrors ? (
                <div className="mb-3 rounded-lg border border-amber-500/40 bg-amber-950/60 px-3 py-2.5">
                    <div className="flex items-start gap-2">
                        <AlertTriangle
                            className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
                            aria-hidden
                        />
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-semibold text-amber-100">
                                Pendientes de cumplimiento
                            </p>
                            <p className="mt-0.5 text-[10px] leading-snug text-amber-200/90">
                                {data!.kardex_with_errors} kardex · {data!.counts.total}{" "}
                                error{data!.counts.total === 1 ? "" : "es"} · {periodLabel}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(true)}
                                    className="rounded-md bg-amber-500/25 px-2 py-1 text-[10px] font-semibold text-amber-50 transition hover:bg-amber-500/35"
                                >
                                    Ver mis kardex
                                </button>
                                <Link
                                    to="/app/panel-general"
                                    onClick={() => setModalOpen(false)}
                                    className="rounded-md border border-amber-500/30 px-2 py-1 text-[10px] font-semibold text-amber-100/90 transition hover:bg-amber-500/15"
                                >
                                    Panel general
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-3 rounded-lg border border-emerald-600/35 bg-emerald-950/40 px-3 py-2.5">
                    <div className="flex items-start gap-2">
                        <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
                            aria-hidden
                        />
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-semibold text-emerald-100">
                                Sin pendientes
                            </p>
                            <p className="mt-0.5 text-[10px] leading-snug text-emerald-200/80">
                                {data?.total_kardex ?? 0} kardex este mes · {periodLabel}
                                {isFetching && (
                                    <span className="ml-1 text-emerald-300/60">· actualizando…</span>
                                )}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(true)}
                                    className="rounded-md border border-emerald-500/25 px-2 py-1 text-[10px] font-semibold text-emerald-100/90 transition hover:bg-emerald-500/15"
                                >
                                    Ver detalle
                                </button>
                                <Link
                                    to="/app/panel-general"
                                    onClick={() => setModalOpen(false)}
                                    className="rounded-md border border-emerald-500/20 px-2 py-1 text-[10px] font-semibold text-emerald-200/80 transition hover:bg-emerald-500/10"
                                >
                                    Panel general
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ComplianceMeKardexModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </>
    )
}

export default ComplianceMeReminder
