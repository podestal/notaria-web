import { useLayoutEffect, useRef, useState } from "react"
import { AlertTriangle, Check, RefreshCw, X } from "lucide-react"
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

const STATUS_LABEL: Record<ProgressStatus, string> = {
    done: "Completado",
    warning: "Aviso",
    error: "Falló",
    idle: "En cola",
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

const findActiveId = (steps: ProgressStep[], stopId: string | null): string | null => {
    if (stopId) return stopId
    for (const step of steps) {
        if (step.children?.length) {
            const nested = findActiveId(step.children, null)
            if (nested) return nested
        }
        if (step.status === "idle") return step.id
        if (step.status === "warning" && !step.children?.length) continue
    }
    return null
}

const ProgressRing = ({
    percent,
    size = 44,
    stroke = 3.5,
    active = false,
    complete = false,
}: {
    percent: number
    size?: number
    stroke?: number
    active?: boolean
    complete?: boolean
}) => {
    const radius = (size - stroke) / 2
    const circumference = 2 * Math.PI * radius
    const clamped = Math.max(0, Math.min(100, percent))
    const offset = circumference - (clamped / 100) * circumference
    const strokeColor = complete ? "#22c55e" : active ? "#3b82f6" : "#94a3b8"

    return (
        <svg width={size} height={size} className="-rotate-90" aria-hidden>
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth={stroke}
            />
            <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={strokeColor}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
        </svg>
    )
}

const StageNode = ({
    status,
    index,
    active,
    hold,
    size = "md",
}: {
    status: ProgressStatus
    index: number
    active?: boolean
    hold?: boolean
    size?: "sm" | "md"
}) => {
    const dim = size === "sm" ? "h-6 w-6 text-[10px]" : "h-8 w-8 text-xs"
    const icon = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"

    if (status === "done") {
        return (
            <motion.span
                data-pipeline-stop={hold ? "true" : undefined}
                className={`relative z-10 flex ${dim} shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm shadow-emerald-200/80`}
                initial={{ scale: 0.55 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 460, damping: 24 }}
            >
                <Check className={icon} strokeWidth={3} aria-hidden />
            </motion.span>
        )
    }

    if (status === "warning") {
        return (
            <span
                data-pipeline-stop={hold ? "true" : undefined}
                className={`relative z-10 flex ${dim} shrink-0 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm shadow-amber-200/80`}
            >
                <AlertTriangle className={icon} aria-hidden />
            </span>
        )
    }

    if (status === "error" || hold) {
        return (
            <span
                data-pipeline-stop={hold ? "true" : undefined}
                className={`node-hold-error relative z-10 flex ${dim} shrink-0 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm shadow-rose-200/80`}
            >
                <X className={icon} strokeWidth={3} aria-hidden />
            </span>
        )
    }

    if (active) {
        return (
            <span
                data-pipeline-stop={hold ? "true" : undefined}
                className={`relative z-10 flex ${dim} shrink-0 items-center justify-center`}
            >
                <span className="absolute inset-0">
                    <ProgressRing percent={72} size={size === "sm" ? 24 : 32} stroke={3} active />
                </span>
                <span className="relative font-semibold tabular-nums text-sky-600">{index}</span>
            </span>
        )
    }

    return (
        <span
            data-pipeline-stop={hold ? "true" : undefined}
            className={`relative z-10 flex ${dim} shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 font-semibold tabular-nums text-slate-500`}
        >
            {index}
        </span>
    )
}

const FlowArrow = ({ filled = false }: { filled?: boolean }) => (
    <div className="relative flex h-7 w-full items-center justify-center" aria-hidden>
        <div className="absolute left-[15px] top-0 h-full w-px bg-slate-200" />
        <motion.div
            className={`absolute left-[15px] top-0 w-px origin-top ${filled ? "bg-emerald-400" : "bg-slate-300"}`}
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        />
        <span
            className={`absolute left-[15px] top-1/2 z-10 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white ${
                filled ? "bg-emerald-400" : "bg-slate-300"
            }`}
        />
        <svg
            className="absolute left-[15px] top-1/2 h-3 w-8 -translate-y-1/2 text-slate-300"
            viewBox="0 0 32 12"
            fill="none"
        >
            <path
                d="M0 6 H22 C24 6 26 4 28 2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className={filled ? "text-emerald-400" : "text-slate-300"}
            />
            <path
                d="M24 1.5 L28 2 L26.5 5.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={filled ? "text-emerald-400" : "text-slate-300"}
            />
        </svg>
    </div>
)

const BranchConnector = ({ filled = false }: { filled?: boolean }) => (
    <div className="relative h-9 pl-1" aria-hidden>
        <svg className="h-full w-full max-w-[9rem] overflow-visible" viewBox="0 0 140 36" fill="none">
            <path
                d="M15 0 V12 C15 18 15 18 28 18 H108 C120 18 120 18 120 24 V30"
                stroke={filled ? "#34d399" : "#cbd5e1"}
                strokeWidth="1.6"
                strokeLinecap="round"
            />
            <circle cx="15" cy="1" r="2.75" fill={filled ? "#34d399" : "#cbd5e1"} />
            <circle cx="120" cy="30" r="2.75" fill={filled ? "#34d399" : "#cbd5e1"} />
            <path
                d="M116 26.5 L120 30.5 L124 26.5"
                stroke={filled ? "#34d399" : "#cbd5e1"}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    </div>
)

const IssueList = ({ issues }: { issues: ProgressIssue[] }) => {
    if (!issues.length) return null
    return (
        <ul className="mt-1.5 space-y-1">
            {issues.map((issue) => (
                <li
                    key={`${issue.source ?? ""}-${issue.text}`}
                    className={`whitespace-normal break-words text-[11px] leading-snug ${
                        issue.level === "error" ? "text-rose-600" : "text-amber-700"
                    }`}
                >
                    {issue.source ? (
                        <span className="mr-1 font-semibold uppercase tracking-wide opacity-80">
                            {issue.source}
                        </span>
                    ) : null}
                    {issue.text}
                </li>
            ))}
        </ul>
    )
}

const ChildJob = ({
    step,
    index,
    stopId,
    waiting,
    activeId,
}: {
    step: ProgressStep
    index: number
    stopId: string | null
    waiting?: boolean
    activeId: string | null
}) => {
    const hold = step.id === stopId
    const active = !waiting && step.id === activeId && step.status === "idle"
    const status = waiting ? "idle" : step.status

    return (
        <motion.div
            className={`flex items-start gap-2.5 px-3 py-2 ${waiting ? "opacity-45" : ""}`}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: waiting ? 0.45 : 1, x: 0 }}
            transition={{ duration: 0.25, delay: index * 0.05 }}
        >
            <StageNode status={status} index={index} active={active} hold={hold} size="sm" />
            <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-center justify-between gap-2">
                    <p className="min-w-0 flex-1 text-[13px] font-medium leading-snug text-slate-800">
                        {step.label}
                    </p>
                    {/* Green check already means done — skip repeating "Completado". */}
                    {(waiting || active || status === "warning" || status === "error") && (
                        <span
                            className={`shrink-0 text-[10px] font-semibold uppercase tracking-wider ${
                                waiting
                                    ? "text-slate-400"
                                    : status === "warning"
                                      ? "text-amber-600"
                                      : status === "error"
                                        ? "text-rose-600"
                                        : active
                                          ? "text-sky-600"
                                          : "text-slate-400"
                            }`}
                        >
                            {waiting ? "En cola" : active ? "En curso" : STATUS_LABEL[status]}
                        </span>
                    )}
                </div>
                {!waiting && <IssueList issues={step.issues} />}
            </div>
        </motion.div>
    )
}

const StageCard = ({
    step,
    index,
    stopId,
    waiting,
    activeId,
}: {
    step: ProgressStep
    index: number
    stopId: string | null
    waiting?: boolean
    activeId: string | null
}) => {
    const hold = containsStop(step, stopId)
    const hasChildren = Boolean(step.children?.length)
    const active =
        !waiting &&
        (step.id === activeId || step.children?.some((child) => child.id === activeId)) &&
        (step.status === "idle" || step.children?.some((child) => child.status === "idle"))
    const status = waiting ? "idle" : step.status
    const filled = !waiting && (status === "done" || status === "warning")

    return (
        <motion.article
            className={`relative ${waiting ? "opacity-45" : ""}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: waiting ? 0.45 : 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.06, ease: "easeOut" }}
        >
            <div className="flex gap-3">
                <div className="flex w-8 shrink-0 flex-col items-center pt-3">
                    <StageNode
                        status={status}
                        index={index}
                        active={Boolean(active) && !hasChildren}
                        hold={step.id === stopId}
                    />
                </div>

                <div
                    className={`min-w-0 flex-1 overflow-hidden rounded-2xl border bg-white shadow-sm ${
                        hold && status === "error"
                            ? "border-rose-200"
                            : active
                              ? "border-sky-200"
                              : filled
                                ? "border-emerald-100"
                                : "border-slate-200"
                    }`}
                >
                    <div
                        className={`flex items-center justify-between gap-2 border-b px-3.5 py-2.5 ${
                            hold && status === "error"
                                ? "border-rose-100 bg-rose-50/60"
                                : active
                                  ? "border-sky-100 bg-sky-50/70"
                                  : filled
                                    ? "border-emerald-50 bg-emerald-50/40"
                                    : "border-slate-100 bg-slate-50/80"
                        }`}
                    >
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold leading-snug text-slate-900">{step.label}</p>
                        </div>
                        {/* Done/idle use the node icon only — keep badges for active issues. */}
                        {(waiting || active || status === "warning" || status === "error") && (
                            <span
                                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                                    waiting
                                        ? "bg-slate-100 text-slate-400"
                                        : status === "warning"
                                          ? "bg-amber-100 text-amber-700"
                                          : status === "error"
                                            ? "bg-rose-100 text-rose-700"
                                            : "bg-sky-100 text-sky-700"
                                }`}
                            >
                                {waiting ? "En cola" : active ? "En curso" : STATUS_LABEL[status]}
                            </span>
                        )}
                    </div>

                    {!waiting && step.issues.length > 0 && !hasChildren && (
                        <div className="px-3.5 py-2">
                            <IssueList issues={step.issues} />
                        </div>
                    )}

                    {hasChildren && (
                        <div className="divide-y divide-slate-100">
                            {step.children!.map((child, childIndex) => (
                                <ChildJob
                                    key={child.id}
                                    step={child}
                                    index={childIndex + 1}
                                    stopId={waiting ? null : stopId}
                                    waiting={waiting}
                                    activeId={activeId}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.article>
    )
}

const PipelineTrack = ({
    steps,
    running,
    stopId,
    activeId,
}: {
    steps: ProgressStep[]
    running: boolean
    stopId: string | null
    activeId: string | null
}) => {
    const rootRef = useRef<HTMLDivElement>(null)
    const [end, setEnd] = useState<number | null>(null)
    const blockAt = stopId ? steps.findIndex((step) => containsStop(step, stopId)) : -1

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
            setEnd(Math.max(root.scrollHeight - 16, 0))
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
        <div ref={rootRef} className="relative space-y-0">
            {running && end != null && end > 0 && !stopId &&
                [0, 1, 2].map((bead) => (
                    <span
                        key={`run-${bead}-${Math.round(end)}`}
                        className={`pipeline-run pipeline-bead pipeline-bead-${bead} absolute left-4 z-20 rounded-full`}
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
                        className="pipeline-halt-ring absolute left-4 z-10 h-7 w-7 rounded-full border border-rose-300/80"
                        style={{ top: end }}
                        aria-hidden
                    />
                    <span
                        key={`halt-${Math.round(end)}`}
                        className="pipeline-halt absolute left-4 z-20 rounded-full"
                        style={{ ["--pipeline-end" as string]: `${end}px` }}
                        aria-hidden
                    />
                </>
            )}

            {steps.map((step, index) => {
                const waiting = blockAt !== -1 && index > blockAt
                const prev = index > 0 ? steps[index - 1] : null
                const prevFilled =
                    prev != null &&
                    !(blockAt !== -1 && index - 1 > blockAt) &&
                    (prev.status === "done" || prev.status === "warning")
                const branched = Boolean(prev?.children?.length)

                return (
                    <div key={step.id}>
                        {index > 0 && (
                            branched ? (
                                <BranchConnector filled={prevFilled} />
                            ) : (
                                <FlowArrow filled={prevFilled} />
                            )
                        )}
                        <StageCard
                            step={step}
                            index={index + 1}
                            stopId={stopId}
                            waiting={waiting}
                            activeId={activeId}
                        />
                    </div>
                )
            })}
        </div>
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
    const stopId = loading || complete ? null : findFirstErrorId(steps)
    const activeId = loading || complete ? null : findActiveId(steps, stopId)

    let summary = "En cola"
    let summaryClass = "text-slate-500"
    let chipClass = "border-slate-200 bg-slate-100 text-slate-600"
    if (loading) {
        summary = "En curso"
        summaryClass = "text-sky-700"
        chipClass = "border-sky-200 bg-sky-50 text-sky-700"
    } else if (isError) {
        summary = "Falló"
        summaryClass = "text-rose-600"
        chipClass = "border-rose-200 bg-rose-50 text-rose-700"
    } else if (complete) {
        summary = warningCount > 0 ? "Completado con avisos" : "Completado"
        summaryClass = "text-emerald-700"
        chipClass = "border-emerald-200 bg-emerald-50 text-emerald-700"
    } else if (errorCount > 0 || stopped) {
        summary = "Incompleto"
        summaryClass = errorCount > 0 ? "text-rose-600" : "text-slate-600"
        chipClass = errorCount > 0
            ? "border-rose-200 bg-rose-50 text-rose-700"
            : "border-slate-200 bg-slate-100 text-slate-600"
    } else if (percent > 0) {
        summary = "En curso"
        summaryClass = "text-sky-700"
        chipClass = "border-sky-200 bg-sky-50 text-sky-700"
    }

    return (
        <aside className="flex h-full min-h-0 w-full flex-col overflow-hidden border-slate-200 bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-700 lg:border-r">
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
                    background: #10b981;
                    box-shadow: 0 0 8px rgba(16, 185, 129, 0.55);
                }
                .pipeline-bead-1 {
                    width: 6px;
                    height: 6px;
                    background: #34d399;
                    box-shadow: 0 0 6px rgba(52, 211, 153, 0.45);
                }
                .pipeline-bead-2 {
                    width: 4px;
                    height: 4px;
                    background: #6ee7b7;
                    box-shadow: 0 0 4px rgba(110, 231, 183, 0.4);
                }
                @keyframes pipeline-halt {
                    0% { top: -8px; opacity: 0; transform: translateX(-50%) scale(0.6); }
                    16% { opacity: 1; transform: translateX(-50%) scale(1); }
                    72% { top: var(--pipeline-end); opacity: 1; transform: translateX(-50%) scale(1); }
                    100% { top: var(--pipeline-end); opacity: 1; transform: translateX(-50%) scale(1.2); }
                }
                @keyframes pipeline-halt-glow {
                    0%, 100% { box-shadow: 0 0 8px rgba(244, 63, 94, 0.55), 0 0 0 0 rgba(244, 63, 94, 0.35); }
                    50% { box-shadow: 0 0 12px rgba(244, 63, 94, 0.35), 0 0 0 6px rgba(244, 63, 94, 0); }
                }
                .pipeline-halt {
                    width: 8px;
                    height: 8px;
                    background: #fb7185;
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
                    0%, 100% { opacity: 0.45; box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.3); }
                    50% { opacity: 1; box-shadow: 0 0 10px rgba(244, 63, 94, 0.25), 0 0 0 5px rgba(244, 63, 94, 0); }
                }
                .pipeline-halt-ring {
                    animation:
                        pipeline-halt-ring 1.7s ease-out forwards,
                        pipeline-halt-breathe 2s ease-in-out 1.7s infinite;
                }
                @keyframes node-hold-error {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.4); }
                    50% { box-shadow: 0 0 0 5px rgba(244, 63, 94, 0); }
                }
                .node-hold-error { animation: node-hold-error 2s ease-in-out infinite; }
                @media (prefers-reduced-motion: reduce) {
                    .pipeline-run, .pipeline-halt, .pipeline-halt-ring, .node-hold-error { animation: none; opacity: 0; }
                }
            `}</style>

            <div className="border-b border-slate-200/80 bg-white/90 px-4 py-4 backdrop-blur">
                <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                        <ProgressRing
                            percent={loading ? 18 : percent}
                            size={52}
                            stroke={4}
                            active={!complete && !isError && (loading || percent > 0)}
                            complete={complete}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold tabular-nums text-slate-800">
                            {loading ? "…" : complete ? (
                                <Check className="h-4 w-4 text-emerald-500" strokeWidth={3} aria-hidden />
                            ) : (
                                `${percent}%`
                            )}
                        </span>
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-600">
                                    Avance del kardex
                                </p>
                                <p className="mt-0.5 truncate font-mono text-sm font-semibold text-slate-900">
                                    {kardex}
                                </p>
                            </div>
                            {onRefresh && (
                                <button
                                    type="button"
                                    onClick={refresh}
                                    disabled={refreshing || loading}
                                    title="Actualizar avance"
                                    className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[10px] font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} aria-hidden />
                                    Actualizar
                                </button>
                            )}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${chipClass}`}>
                                {summary}
                            </span>
                            <span className={`text-[11px] ${summaryClass}`}>
                                {loading
                                    ? "Revisando etapas"
                                    : errorCount > 0
                                      ? `${errorCount} error${errorCount === 1 ? "" : "es"}`
                                      : warningCount > 0
                                        ? `${warningCount} aviso${warningCount === 1 ? "" : "s"}`
                                        : `${stagesDone} de ${stageTotal} etapas`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-4">
                {isError && !data && (
                    <p className="py-6 text-center text-xs text-rose-600">
                        No se pudieron cargar las incidencias.
                    </p>
                )}
                {!isError && (
                    <PipelineTrack
                        steps={steps}
                        running={!loading && (complete || findFirstErrorId(steps) != null)}
                        stopId={stopId}
                        activeId={activeId}
                    />
                )}
                {!loading && unmatched.length > 0 && (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-3.5 py-3 shadow-sm">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            Otras incidencias
                        </p>
                        <ul className="mt-2 space-y-1">
                            {unmatched.map((issue) => (
                                <li
                                    key={issue.text}
                                    className={`whitespace-normal break-words text-[11px] leading-snug ${
                                        issue.level === "error" ? "text-rose-700" : "text-amber-800"
                                    }`}
                                >
                                    {issue.text}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-x-3 gap-y-1 border-t border-slate-200 bg-white/90 px-4 py-2.5 text-[10px] text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <Check className="h-2 w-2" strokeWidth={3} aria-hidden />
                    </span>
                    Completado
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                        <span className="absolute inset-0 rounded-full border-2 border-sky-400 border-t-transparent" />
                    </span>
                    En curso
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Falló
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full border border-slate-300 bg-slate-100" /> En cola
                </span>
            </div>
        </aside>
    )
}

export default KardexProgressPanel
