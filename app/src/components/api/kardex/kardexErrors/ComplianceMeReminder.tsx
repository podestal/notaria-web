import { useEffect, useState } from "react"
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import useGetComplianceMeKardex from "../../../../hooks/compliance/useGetComplianceMeKardex"
import useAuthStore from "../../../../store/useAuthStore"
import {
    getComplianceMeTone,
    type ComplianceMeTone,
} from "../../../../services/compliance/complianceService"
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

const toneStyles: Record<
    ComplianceMeTone,
    {
        card: string
        icon: string
        title: string
        body: string
        primaryBtn: string
        secondaryBtn: string
    }
> = {
    amber: {
        card: "border-amber-500/40 bg-amber-950/60",
        icon: "text-amber-400",
        title: "text-amber-100",
        body: "text-amber-200/90",
        primaryBtn:
            "rounded-md bg-amber-500/25 px-2 py-1 text-[10px] font-semibold text-amber-50 transition hover:bg-amber-500/35",
        secondaryBtn:
            "rounded-md border border-amber-500/30 px-2 py-1 text-[10px] font-semibold text-amber-100/90 transition hover:bg-amber-500/15",
    },
    red: {
        card: "compliance-red-glow border-rose-500/55 bg-rose-950/55",
        icon: "text-rose-400",
        title: "text-rose-100",
        body: "text-rose-200/90",
        primaryBtn:
            "rounded-md bg-rose-500/25 px-2 py-1 text-[10px] font-semibold text-rose-50 transition hover:bg-rose-500/35",
        secondaryBtn:
            "rounded-md border border-rose-500/30 px-2 py-1 text-[10px] font-semibold text-rose-100/90 transition hover:bg-rose-500/15",
    },
    green: {
        card: "border-emerald-600/35 bg-emerald-950/40",
        icon: "text-emerald-400",
        title: "text-emerald-100",
        body: "text-emerald-200/80",
        primaryBtn:
            "rounded-md border border-emerald-500/25 px-2 py-1 text-[10px] font-semibold text-emerald-100/90 transition hover:bg-emerald-500/15",
        secondaryBtn:
            "rounded-md border border-emerald-500/20 px-2 py-1 text-[10px] font-semibold text-emerald-200/80 transition hover:bg-emerald-500/10",
    },
}

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

    const tone: ComplianceMeTone = data ? getComplianceMeTone(data) : "green"
    const styles = toneStyles[tone]

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

    const title =
        tone === "amber"
            ? "Pendientes del mes"
            : tone === "red"
              ? "Errores de meses anteriores"
              : "Sin pendientes"

    const months = data?.months?.length
        ? [...data.months].sort((a, b) => a.year - b.year || a.month - b.month)
        : []

    const monthLines = months.map((m) => {
        const count = m.kardex_with_errors ?? 0
        const label = `${MONTH_LABELS[m.month - 1] ?? m.month} ${m.year}`
        const isFocus = m.year === data?.year && m.month === data?.month
        return isFocus
            ? `${count} kardex este mes · ${label}`
            : `${count} kardex ${label}`
    })

    return (
        <>
            <style>{`
                @keyframes compliance-red-glow {
                    0%, 100% {
                        box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.15),
                            0 0 8px 0 rgba(244, 63, 94, 0.2);
                        border-color: rgba(244, 63, 94, 0.45);
                    }
                    50% {
                        box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.12),
                            0 0 18px 2px rgba(244, 63, 94, 0.45);
                        border-color: rgba(251, 113, 133, 0.8);
                    }
                }
                .compliance-red-glow {
                    animation: compliance-red-glow 2.4s ease-in-out infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .compliance-red-glow {
                        animation: none;
                        box-shadow: 0 0 12px 1px rgba(244, 63, 94, 0.35);
                    }
                }
            `}</style>
            <div className={`mb-3 rounded-lg border px-3 py-2.5 ${styles.card}`}>
                <div className="flex items-start gap-2">
                    {tone === "green" ? (
                        <CheckCircle2
                            className={`mt-0.5 h-4 w-4 shrink-0 ${styles.icon}`}
                            aria-hidden
                        />
                    ) : (
                        <AlertTriangle
                            className={`mt-0.5 h-4 w-4 shrink-0 ${styles.icon}`}
                            aria-hidden
                        />
                    )}
                    <div className="min-w-0 flex-1">
                        <p className={`text-[11px] font-semibold ${styles.title}`}>{title}</p>
                        <div className={`mt-0.5 space-y-0.5 text-[10px] leading-snug ${styles.body}`}>
                            {monthLines.map((line) => (
                                <p key={line}>{line}</p>
                            ))}
                            {isFetching && (
                                <p className="opacity-70">actualizando…</p>
                            )}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setModalOpen(true)}
                                className={styles.primaryBtn}
                            >
                                {tone === "green" ? "Ver detalle" : "Ver mis kardex"}
                            </button>
                            <Link
                                to="/app/panel-general"
                                onClick={() => setModalOpen(false)}
                                className={styles.secondaryBtn}
                            >
                                Panel general
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <ComplianceMeKardexModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </>
    )
}

export default ComplianceMeReminder
