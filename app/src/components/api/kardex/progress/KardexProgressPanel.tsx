import { useLayoutEffect, useRef, useState } from "react"
import { AlertTriangle, Check, CircleDashed, RefreshCw, X } from "lucide-react"
import { motion } from "framer-motion"
import type { ComplianceKardexErrorsResponse } from "../../../../services/compliance/complianceService"
import useAuthStore from "../../../../store/useAuthStore"
import useGetContratantesProgress from "../../../../hooks/compliance/useGetContratantesProgress"
import useGetPatrimonialProgress from "../../../../hooks/compliance/useGetPatrimonialProgress"
import useGetParticipaProgress from "../../../../hooks/compliance/useGetParticipaProgress"
import useGetInstrumentoProgress from "../../../../hooks/compliance/useGetInstrumentoProgress"
import {
    buildKardexProgress,
    kardexCompletion,
    type PatrimonialStageStep,
    type ProgressIssue,
    type ProgressStatus,
    type ProgressStep,
} from "./kardexProgressModel"

interface Props {
    kardex: string
    idtipkar?: number | null
    data?: ComplianceKardexErrorsResponse
    enabled?: boolean
    isLoading?: boolean
    isError?: boolean
    isRefreshing?: boolean
    onRefresh?: () => void
}

const LINE: Record<ProgressStatus, string> = {
    done: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
    warning: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]",
    error: "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]",
    idle: "bg-slate-600",
}

const NODE: Record<ProgressStatus, string> = {
    done: "border-emerald-400 bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.55)]",
    warning: "border-amber-300 bg-amber-500 text-white shadow-[0_0_12px_rgba(245,158,11,0.5)]",
    error: "border-rose-300 bg-rose-500 text-white shadow-[0_0_14px_rgba(244,63,94,0.7)]",
    idle: "border-slate-500 bg-slate-900 text-slate-400",
}

const LABEL: Record<ProgressStatus, string> = {
    done: "text-emerald-300",
    warning: "text-amber-300",
    error: "text-rose-300",
    idle: "text-slate-400",
}

const STATUS_LABEL: Record<ProgressStatus, string> = {
    done: "Listo",
    warning: "Aviso",
    error: "Falló",
    idle: "Sin iniciar",
}

const CARD: Record<ProgressStatus, string> = {
    done: "border-emerald-400/30 bg-emerald-400/10",
    warning: "border-amber-400/30 bg-amber-400/10",
    error: "border-rose-400/40 bg-rose-500/15",
    idle: "border-slate-600/80 bg-slate-800/40",
}

const isBlocked = (status: ProgressStatus) => status === "error" || status === "idle"

const findFirstErrorId = (steps: ProgressStep[]): string | null => {
    for (const step of steps) {
        if (step.children?.length) {
            const nested = findFirstErrorId(step.children)
            if (nested) return nested
        }
        if (step.status === "error") return step.id
    }
    return null
}

const containsStop = (step: ProgressStep, stopId: string | null): boolean => {
    if (!stopId) return false
    if (step.id === stopId) return true
    return step.children?.some((child) => containsStop(child, stopId)) ?? false
}

const NodeIcon = ({ status }: { status: ProgressStatus }) => {
    if (status === "done") return <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
    if (status === "warning") return <AlertTriangle className="h-3 w-3" aria-hidden />
    if (status === "error") return <X className="h-3 w-3" strokeWidth={3} aria-hidden />
    return <CircleDashed className="h-3 w-3" aria-hidden />
}

const Connector = ({ status }: { status: ProgressStatus }) => (
    <div className="relative mt-1 w-0.5 flex-1 overflow-hidden rounded-full bg-slate-800">
        <motion.div
            className={`absolute inset-x-0 top-0 origin-top ${LINE[status]}`}
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ duration: 0.45, ease: "easeOut" }}
        />
    </div>
)

const StepRow = ({
    step,
    index,
    nested = false,
    isLast = false,
    stopId,
    waiting = false,
}: {
    step: ProgressStep
    index: number
    nested?: boolean
    isLast?: boolean
    stopId: string | null
    waiting?: boolean
}) => {
    const hold = step.id === stopId
    const statusKey: ProgressStatus = waiting ? "idle" : step.status

    return (
        <motion.li
            className={`relative ${waiting ? "opacity-45" : ""}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: waiting ? 0.45 : 1, x: 0 }}
            transition={{ duration: 0.28, delay: index * 0.06, ease: "easeOut" }}
        >
            <div className="flex gap-3">
                <div className="flex w-6 shrink-0 flex-col items-center">
                    <motion.span
                        data-pipeline-stop={hold ? "true" : undefined}
                        className={`z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${NODE[statusKey]} ${hold ? "node-hold-error" : ""} ${
                            nested ? "h-5 w-5" : ""
                        }`}
                        initial={{ scale: 0.6 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 420, damping: 22, delay: index * 0.06 }}
                    >
                        <NodeIcon status={waiting ? "idle" : step.status} />
                    </motion.span>
                    {!isLast && (
                        <Connector status={waiting ? "idle" : step.status} />
                    )}
                </div>

                <div className={`min-w-0 flex-1 ${isLast ? "pb-1" : "pb-3"}`}>
                    <div className={`rounded-lg border px-2.5 py-2 ${waiting ? CARD.idle : CARD[step.status]}`}>
                        <div className="flex items-center justify-between gap-2">
                            <p className={`truncate font-semibold text-slate-100 ${nested ? "text-[13px]" : "text-sm"}`}>
                                {step.label}
                            </p>
                            <span className={`shrink-0 font-mono text-[10px] font-semibold uppercase tracking-wider ${waiting ? "text-slate-500" : LABEL[step.status]}`}>
                                {waiting ? "En cola" : STATUS_LABEL[step.status]}
                            </span>
                        </div>
                        {!waiting && step.issues.map((issue) => (
                            <p
                                key={`${issue.source ?? ""}-${issue.text}`}
                                className={`mt-1 whitespace-normal break-words text-[11px] leading-snug ${
                                    issue.level === "error" ? "text-rose-200" : "text-amber-200"
                                }`}
                            >
                                {issue.source ? (
                                    <span className="mr-1.5 font-semibold uppercase tracking-wide">
                                        {issue.source}
                                    </span>
                                ) : null}
                                {issue.text}
                            </p>
                        ))}
                    </div>

                    {step.children && step.children.length > 0 && (
                        <ol className="relative mt-2 ml-1">
                            <PipelineList
                                steps={step.children}
                                nested
                                startIndex={index + 1}
                                stopId={waiting ? null : stopId}
                            />
                        </ol>
                    )}
                </div>
            </div>
        </motion.li>
    )
}

const PipelineList = ({
    steps,
    nested = false,
    startIndex = 0,
    stopId,
}: {
    steps: ProgressStep[]
    nested?: boolean
    startIndex?: number
    stopId: string | null
}) => {
    const blockAt = stopId ? steps.findIndex((step) => containsStop(step, stopId)) : -1
    return (
        <>
            {steps.map((step, index) => (
                <StepRow
                    key={step.id}
                    step={step}
                    index={startIndex + index}
                    nested={nested}
                    isLast={index === steps.length - 1}
                    stopId={stopId}
                    waiting={blockAt !== -1 && index > blockAt}
                />
            ))}
        </>
    )
}

const PipelineTrack = ({
    steps,
    running,
    stopId,
}: {
    steps: ProgressStep[]
    running: boolean
    stopId: string | null
}) => {
    const rootRef = useRef<HTMLOListElement>(null)
    const [end, setEnd] = useState<number | null>(null)

    useLayoutEffect(() => {
        const root = rootRef.current
        if (!root || !running) {
            setEnd(null)
            return
        }
        const measure = () => {
            const node = stopId
                ? root.querySelector<HTMLElement>("[data-pipeline-stop='true']")
                : null
            if (stopId) {
                if (!node) return
                const rootBox = root.getBoundingClientRect()
                const nodeBox = node.getBoundingClientRect()
                setEnd(Math.max(nodeBox.top - rootBox.top + nodeBox.height / 2, 0))
                return
            }
            setEnd(Math.max(root.scrollHeight - 12, 0))
        }
        measure()
        const frame = requestAnimationFrame(measure)
        const observer = new ResizeObserver(measure)
        observer.observe(root)
        return () => {
            cancelAnimationFrame(frame)
            observer.disconnect()
        }
    }, [running, stopId, steps])

    return (
        <ol ref={rootRef} className="relative">
            {running && end != null && end > 0 && !stopId &&
                [0, 1, 2].map((bead) => (
                    <span
                        key={`run-${bead}-${Math.round(end)}`}
                        className={`pipeline-run pipeline-bead pipeline-bead-${bead} absolute left-3 z-20 rounded-full`}
                        style={{
                            ["--pipeline-end" as string]: `${end}px`,
                            animationDelay: `${bead * 0.28}s`,
                        }}
                        aria-hidden
                    />
                ))}
            {running && end != null && end > 0 && stopId && (
                <>
                    <span
                        key={`halt-ring-${Math.round(end)}`}
                        className="pipeline-halt-ring absolute left-3 z-10 h-7 w-7 rounded-full border border-rose-300/80"
                        style={{ top: end }}
                        aria-hidden
                    />
                    <span
                        key={`halt-${Math.round(end)}`}
                        className="pipeline-halt absolute left-3 z-20 rounded-full"
                        style={{ ["--pipeline-end" as string]: `${end}px` }}
                        aria-hidden
                    />
                </>
            )}
            <PipelineList steps={steps} stopId={stopId} />
        </ol>
    )
}

const toIssues = (
    issues: { level: string; text: string; source?: string }[],
): ProgressIssue[] =>
    issues.map((issue) => ({
        level: issue.level === "warning" ? "warning" : "error",
        text: issue.text,
        source: issue.source,
    }))

const toSteps = (
    steps: { id: string; status: PatrimonialStageStep["status"]; issues: { level: string; text: string; source?: string }[] }[] | undefined,
): PatrimonialStageStep[] | null =>
    steps
        ? steps.map((step) => ({
            id: step.id,
            status: step.status,
            issues: toIssues(step.issues),
        }))
        : null

const KardexProgressPanel = ({
    kardex,
    idtipkar,
    data,
    enabled = true,
    isLoading = false,
    isError = false,
    isRefreshing = false,
    onRefresh,
}: Props) => {
    const access = useAuthStore((state) => state.access_token) || ""
    const canQuery = enabled && Boolean(access) && Boolean(kardex)
    const contratantesQuery = useGetContratantesProgress({ access, kardex, enabled: canQuery })
    const patrimonialQuery = useGetPatrimonialProgress({ access, kardex, enabled: canQuery })
    const participaQuery = useGetParticipaProgress({ access, kardex, enabled: canQuery })
    const instrumentoQuery = useGetInstrumentoProgress({ access, kardex, enabled: canQuery })
    const stageLoading =
        contratantesQuery.isLoading ||
        patrimonialQuery.isLoading ||
        participaQuery.isLoading ||
        instrumentoQuery.isLoading
    const stageRefreshing =
        contratantesQuery.isFetching ||
        patrimonialQuery.isFetching ||
        participaQuery.isFetching ||
        instrumentoQuery.isFetching
    const contratantes = contratantesQuery.data
        ? {
            status: contratantesQuery.data.status,
            issues: toIssues(contratantesQuery.data.issues),
        }
        : null
    const patrimonial = toSteps(patrimonialQuery.data?.steps)
    const participa = toSteps(participaQuery.data?.steps)
    const instrumento = toSteps(instrumentoQuery.data?.steps)
    const refresh = () => {
        onRefresh?.()
        void contratantesQuery.refetch()
        void patrimonialQuery.refetch()
        void participaQuery.refetch()
        void instrumentoQuery.refetch()
    }
    const loading = isLoading || stageLoading
    const refreshing = isRefreshing || stageRefreshing

    const { steps, unmatched } = buildKardexProgress(
        idtipkar,
        data,
        contratantes,
        patrimonial,
        participa,
        instrumento,
    )
    const score = kardexCompletion(steps, unmatched)
    const { percent, stagesDone, stageTotal, errorCount, warningCount, complete } = score
    const stopped = !complete && steps.some((step) => isBlocked(step.status))

    let summary = "En cola"
    let summaryClass = "text-slate-400"
    let barClass = "bg-slate-500"
    let runClass = "border-slate-600 bg-slate-800 text-slate-300"
    if (loading) {
        summary = "En curso"
        summaryClass = "text-sky-300"
        barClass = "bg-sky-400"
        runClass = "border-sky-400/40 bg-sky-400/15 text-sky-200"
    } else if (isError) {
        summary = "Falló"
        summaryClass = "text-rose-300"
        barClass = "bg-rose-400"
        runClass = "border-rose-400/40 bg-rose-500/15 text-rose-200"
    } else if (complete) {
        summary = warningCount > 0 ? "Listo con avisos" : "Listo"
        summaryClass = "text-emerald-300"
        barClass = "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
        runClass = "border-emerald-400/40 bg-emerald-400/15 text-emerald-200"
    } else if (errorCount > 0 || stopped) {
        summary = "Incompleto"
        summaryClass = errorCount > 0 ? "text-rose-300" : "text-slate-300"
        barClass = errorCount > 0
            ? "bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.75)]"
            : "bg-slate-400"
        runClass = errorCount > 0
            ? "border-rose-400/40 bg-rose-500/15 text-rose-200"
            : "border-slate-500 bg-slate-800 text-slate-300"
    } else if (percent > 0) {
        summary = "En curso"
        summaryClass = "text-emerald-300"
        barClass = "bg-emerald-400"
        runClass = "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
    }

    return (
        <aside className="keep-dark flex h-full min-h-0 w-full flex-col overflow-hidden border-slate-800 bg-slate-950 text-slate-200 lg:border-r">
            <style>{`
                @keyframes pipeline-run {
                    0% { top: -8px; opacity: 0; transform: translateX(-50%) scale(0.55); }
                    10% { opacity: 1; transform: translateX(-50%) scale(1); }
                    86% { opacity: 0.95; transform: translateX(-50%) scale(1); }
                    100% { top: var(--pipeline-end); opacity: 0; transform: translateX(-50%) scale(0.45); }
                }
                .pipeline-run {
                    animation: pipeline-run 3.1s cubic-bezier(0.45, 0, 0.2, 1) infinite;
                    animation-fill-mode: backwards;
                }
                .pipeline-bead {
                    width: 8px;
                    height: 8px;
                    background: #fff;
                    box-shadow: 0 0 10px rgba(167, 243, 208, 0.95), 0 0 2px #fff;
                }
                .pipeline-bead-1 {
                    width: 6px;
                    height: 6px;
                    background: #a7f3d0;
                    box-shadow: 0 0 8px rgba(52, 211, 153, 0.75);
                }
                .pipeline-bead-2 {
                    width: 4px;
                    height: 4px;
                    background: #34d399;
                    box-shadow: 0 0 6px rgba(16, 185, 129, 0.55);
                }
                @keyframes pipeline-halt {
                    0% { top: -8px; opacity: 0; transform: translateX(-50%) scale(0.6); }
                    16% { opacity: 1; transform: translateX(-50%) scale(1); }
                    72% { top: var(--pipeline-end); opacity: 1; transform: translateX(-50%) scale(1); }
                    100% { top: var(--pipeline-end); opacity: 1; transform: translateX(-50%) scale(1.2); }
                }
                @keyframes pipeline-halt-glow {
                    0%, 100% { box-shadow: 0 0 10px rgba(251, 113, 133, 0.85), 0 0 0 0 rgba(251, 113, 133, 0.45); }
                    50% { box-shadow: 0 0 16px rgba(251, 113, 133, 0.45), 0 0 0 7px rgba(251, 113, 133, 0); }
                }
                .pipeline-halt {
                    width: 8px;
                    height: 8px;
                    background: #ffe4e6;
                    animation:
                        pipeline-halt 1.7s cubic-bezier(0.16, 1, 0.3, 1) forwards,
                        pipeline-halt-glow 1.8s ease-in-out 1.7s infinite;
                }
                @keyframes pipeline-halt-ring {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.35); }
                    55% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                    100% { opacity: 0.9; transform: translate(-50%, -50%) scale(1); }
                }
                @keyframes pipeline-halt-breathe {
                    0%, 100% { opacity: 0.55; box-shadow: 0 0 0 0 rgba(251, 113, 133, 0.4); }
                    50% { opacity: 1; box-shadow: 0 0 12px rgba(251, 113, 133, 0.35), 0 0 0 6px rgba(251, 113, 133, 0); }
                }
                .pipeline-halt-ring {
                    animation:
                        pipeline-halt-ring 1.7s ease-out forwards,
                        pipeline-halt-breathe 2s ease-in-out 1.7s infinite;
                }
                @keyframes node-hold-error {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.45), 0 0 12px rgba(244, 63, 94, 0.35); }
                    50% { box-shadow: 0 0 0 6px rgba(244, 63, 94, 0), 0 0 18px rgba(244, 63, 94, 0.15); }
                }
                .node-hold-error { animation: node-hold-error 2s ease-in-out infinite; }
                @keyframes pipeline-bar {
                    0% { transform: translateX(-60%); }
                    100% { transform: translateX(220%); }
                }
                .pipeline-bar-loading {
                    width: 40%;
                    animation: pipeline-bar 1.2s ease-in-out infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .pipeline-run, .pipeline-halt, .pipeline-halt-ring, .node-hold-error { animation: none; opacity: 0; }
                    .pipeline-bar-loading { animation: none; }
                }
            `}</style>

            <div className="border-b border-slate-800 bg-slate-900/80 px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-300/80">
                            Pipeline
                        </p>
                        <p className="mt-1 truncate font-mono text-sm font-semibold text-white">{kardex}</p>
                        <span className={`mt-2 inline-flex rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${runClass}`}>
                            {summary}
                        </span>
                        <p className={`mt-1 text-[11px] ${summaryClass}`}>
                            {loading
                                ? "Revisando etapas"
                                : errorCount > 0
                                  ? `${errorCount} error${errorCount === 1 ? "" : "es"}`
                                  : warningCount > 0
                                    ? `${warningCount} aviso${warningCount === 1 ? "" : "s"}`
                                    : `${stagesDone} de ${stageTotal} etapas`}
                        </p>
                    </div>
                    {onRefresh && (
                        <button
                            type="button"
                            onClick={refresh}
                            disabled={refreshing || loading}
                            title="Actualizar avance"
                            className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 font-mono text-[10px] font-semibold text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} aria-hidden />
                            Actualizar
                        </button>
                    )}
                </div>

                <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between font-mono text-[10px] font-medium text-slate-400">
                        <span>
                            {loading
                                ? "Revisando"
                                : `${stagesDone}/${stageTotal} etapas`}
                        </span>
                        <span className="tabular-nums text-slate-200">{loading ? "" : `${percent}%`}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                        {loading ? (
                            <div className={`pipeline-bar-loading h-full rounded-full ${barClass}`} />
                        ) : (
                            <motion.div
                                className={`h-full rounded-full ${barClass}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${percent}%` }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                {isError && !data && (
                    <p className="py-6 text-center text-xs text-rose-300">
                        No se pudieron cargar las incidencias.
                    </p>
                )}
                {!isError && (
                    <PipelineTrack
                        steps={steps}
                        running={!loading && (complete || findFirstErrorId(steps) != null)}
                        stopId={loading || complete ? null : findFirstErrorId(steps)}
                    />
                )}
                {!loading && unmatched.length > 0 && (
                    <div className="mt-2 border-t border-slate-800 pt-3">
                        <p className="font-mono text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                            Otras incidencias
                        </p>
                        <ul className="mt-2 space-y-1">
                            {unmatched.map((issue) => (
                                <li
                                    key={issue.text}
                                    className={`whitespace-normal break-words text-[11px] leading-snug ${
                                        issue.level === "error" ? "text-rose-200" : "text-amber-200"
                                    }`}
                                >
                                    {issue.text}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-x-3 gap-y-1 border-t border-slate-800 bg-slate-900/70 px-4 py-2 font-mono text-[10px] text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" /> Listo
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-400" /> Aviso
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-400" /> Falló
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full border border-slate-500 bg-slate-900" /> En cola
                </span>
            </div>
        </aside>
    )
}

export default KardexProgressPanel
