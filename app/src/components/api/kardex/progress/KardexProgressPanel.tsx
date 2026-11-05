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
    done: "bg-emerald-400",
    warning: "bg-amber-400",
    error: "bg-rose-400",
    idle: "bg-slate-200",
}

const NODE: Record<ProgressStatus, string> = {
    done: "border-emerald-500 bg-emerald-500 text-white shadow-emerald-200",
    warning: "border-amber-500 bg-amber-500 text-white shadow-amber-200",
    error: "border-rose-500 bg-rose-500 text-white shadow-rose-200",
    idle: "border-slate-300 bg-white text-slate-400 shadow-slate-100",
}

const LABEL: Record<ProgressStatus, string> = {
    done: "text-emerald-700",
    warning: "text-amber-700",
    error: "text-rose-700",
    idle: "text-slate-400",
}

const STATUS_LABEL: Record<ProgressStatus, string> = {
    done: "Listo",
    warning: "Aviso",
    error: "Error",
    idle: "Sin iniciar",
}

const FLOW: Record<ProgressStatus, string> = {
    done: "bg-white",
    warning: "bg-amber-100",
    error: "bg-rose-100",
    idle: "bg-slate-300",
}

type FlowMode = "flow" | "stuck" | "still"

const isBlocked = (status: ProgressStatus) => status === "error" || status === "idle"

const connectorMode = (steps: ProgressStep[], index: number, complete: boolean): FlowMode => {
    if (index >= steps.length - 1) return "still"
    if (complete) return "flow"
    const blockAt = steps.findIndex((step) => isBlocked(step.status))
    if (blockAt === -1) return index === steps.length - 2 ? "stuck" : "flow"
    if (index < blockAt - 1) return "flow"
    if (index === blockAt - 1) return "stuck"
    return "still"
}

const stuckDot = (steps: ProgressStep[], index: number): string => {
    const next = steps[index + 1]
    if (next?.status === "idle") return "bg-slate-300"
    return "bg-rose-200"
}

const NodeIcon = ({ status }: { status: ProgressStatus }) => {
    if (status === "done") return <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
    if (status === "warning") return <AlertTriangle className="h-3 w-3" aria-hidden />
    if (status === "error") return <X className="h-3 w-3" strokeWidth={3} aria-hidden />
    return <CircleDashed className="h-3 w-3" aria-hidden />
}

const Connector = ({
    status,
    mode,
    delay,
    stuckClass,
    complete,
}: {
    status: ProgressStatus
    mode: FlowMode
    delay: number
    stuckClass: string
    complete: boolean
}) => (
    <div className="relative mt-1 w-0.5 flex-1 overflow-hidden rounded-full bg-slate-200">
        <motion.div
            className={`absolute inset-x-0 top-0 origin-top ${LINE[status]}`}
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ duration: 0.45, ease: "easeOut" }}
        />
        {mode === "flow" && (
            <>
                <span
                    className={`${complete ? "pipeline-flow" : "pipeline-flow-slow"} absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full ${FLOW[status]}`}
                    style={{ animationDelay: `${delay}s` }}
                    aria-hidden
                />
                {complete && (
                    <span
                        className={`pipeline-flow-late absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${FLOW[status]}`}
                        style={{ animationDelay: `${delay + 0.55}s` }}
                        aria-hidden
                    />
                )}
            </>
        )}
        {mode === "stuck" && (
            <span
                className={`pipeline-stuck absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full ${stuckClass}`}
                aria-hidden
            />
        )}
    </div>
)

const StepRow = ({
    step,
    index,
    nested = false,
    isLast = false,
    mode,
    complete,
    stuckClass,
}: {
    step: ProgressStep
    index: number
    nested?: boolean
    isLast?: boolean
    mode: FlowMode
    complete: boolean
    stuckClass: string
}) => {
    const hold = !complete && isBlocked(step.status)
    const holdClass = hold ? (step.status === "error" ? "node-hold-error" : "node-hold-idle") : ""

    return (
        <motion.li
            className="relative"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.28, delay: index * 0.06, ease: "easeOut" }}
        >
            <div className="flex gap-3">
                <div className="flex w-6 shrink-0 flex-col items-center">
                    <motion.span
                        className={`z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 shadow-sm ${NODE[step.status]} ${holdClass} ${
                            nested ? "h-5 w-5" : ""
                        }`}
                        initial={{ scale: 0.6 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 420, damping: 22, delay: index * 0.06 }}
                    >
                        <NodeIcon status={step.status} />
                    </motion.span>
                    {!isLast && (
                        <Connector
                            status={step.status}
                            mode={mode}
                            delay={index * 0.16}
                            stuckClass={stuckClass}
                            complete={complete}
                        />
                    )}
                </div>

                <div className={`min-w-0 flex-1 ${isLast ? "pb-1" : "pb-4"}`}>
                    <div className="flex items-center justify-between gap-2">
                        <p className={`truncate font-semibold text-slate-800 ${nested ? "text-[13px]" : "text-sm"}`}>
                            {step.label}
                        </p>
                        <span className={`shrink-0 text-[10px] font-semibold uppercase tracking-wide ${LABEL[step.status]}`}>
                            {STATUS_LABEL[step.status]}
                        </span>
                    </div>

                    {step.issues.map((issue) => (
                        <p
                            key={`${issue.source ?? ""}-${issue.text}`}
                            className={`mt-1 whitespace-normal break-words text-[11px] leading-snug ${
                                issue.level === "error" ? "text-rose-700" : "text-amber-800"
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

                    {step.children && step.children.length > 0 && (
                        <ol className="relative mt-3 ml-1 border-l border-dashed border-slate-200 pl-3">
                            <PipelineList steps={step.children} complete={complete} nested startIndex={index + 1} />
                        </ol>
                    )}
                </div>
            </div>
        </motion.li>
    )
}

const PipelineList = ({
    steps,
    complete,
    nested = false,
    startIndex = 0,
}: {
    steps: ProgressStep[]
    complete: boolean
    nested?: boolean
    startIndex?: number
}) => (
    <>
        {steps.map((step, index) => (
            <StepRow
                key={step.id}
                step={step}
                index={startIndex + index}
                nested={nested}
                isLast={index === steps.length - 1}
                mode={connectorMode(steps, index, complete)}
                complete={complete}
                stuckClass={stuckDot(steps, index)}
            />
        ))}
    </>
)

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

    let summary = "Sin iniciar"
    let summaryClass = "text-slate-500"
    let barClass = "bg-slate-300"
    if (loading) {
        summary = "Revisando etapas…"
        barClass = "bg-sky-400"
    } else if (isError) {
        summary = "No se pudo revisar"
        summaryClass = "text-rose-600"
        barClass = "bg-rose-400"
    } else if (complete) {
        summary = warningCount > 0 ? `Completo · ${warningCount} aviso${warningCount === 1 ? "" : "s"}` : "Completo"
        summaryClass = "text-emerald-700"
        barClass = "bg-emerald-500"
    } else if (errorCount > 0) {
        summary = `${errorCount} error${errorCount === 1 ? "" : "es"} por cerrar`
        summaryClass = "text-rose-600"
        barClass = "bg-rose-500"
    } else if (percent > 0) {
        summary = "En progreso"
        summaryClass = "text-emerald-700"
        barClass = "bg-emerald-500"
    }

    return (
        <aside className="flex h-full min-h-0 w-full flex-col overflow-hidden border-slate-200 bg-slate-50 lg:border-r">
            <style>{`
                @keyframes pipeline-flow {
                    0% { top: -8px; opacity: 0; }
                    12% { opacity: 1; }
                    88% { opacity: 1; }
                    100% { top: calc(100% - 2px); opacity: 0; }
                }
                .pipeline-flow, .pipeline-flow-late {
                    animation: pipeline-flow 1.15s linear infinite;
                    animation-fill-mode: backwards;
                }
                .pipeline-flow-slow {
                    animation: pipeline-flow 2.6s ease-in-out infinite;
                    animation-fill-mode: backwards;
                }
                @keyframes pipeline-stuck {
                    0% { top: -8px; opacity: 0; }
                    14% { opacity: 1; }
                    58% { top: calc(100% - 8px); opacity: 1; }
                    100% { top: calc(100% - 8px); opacity: 0.9; }
                }
                .pipeline-stuck {
                    animation: pipeline-stuck 2.4s ease-in-out infinite;
                }
                @keyframes node-hold-error {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.55); }
                    50% { box-shadow: 0 0 0 5px rgba(244, 63, 94, 0); }
                }
                .node-hold-error { animation: node-hold-error 1.8s ease-in-out infinite; }
                @keyframes node-hold-idle {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(148, 163, 184, 0.75); }
                    50% { box-shadow: 0 0 0 5px rgba(148, 163, 184, 0); }
                }
                .node-hold-idle { animation: node-hold-idle 2.2s ease-in-out infinite; }
                @keyframes pipeline-bar {
                    0% { transform: translateX(-60%); }
                    100% { transform: translateX(220%); }
                }
                .pipeline-bar-loading {
                    width: 40%;
                    animation: pipeline-bar 1.2s ease-in-out infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .pipeline-flow, .pipeline-flow-late, .pipeline-flow-slow, .pipeline-stuck,
                    .node-hold-error, .node-hold-idle { animation: none; opacity: 0; }
                    .pipeline-bar-loading { animation: none; }
                }
            `}</style>

            <div className="border-b border-slate-200 px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                            Avance del kardex
                        </p>
                        <p className="mt-1 truncate text-sm font-semibold text-slate-900">{kardex}</p>
                        <p className={`mt-1 text-xs font-semibold ${summaryClass}`}>{summary}</p>
                    </div>
                    {onRefresh && (
                        <button
                            type="button"
                            onClick={refresh}
                            disabled={refreshing || loading}
                            title="Actualizar avance"
                            className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[10px] font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} aria-hidden />
                            Actualizar
                        </button>
                    )}
                </div>

                <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-[10px] font-medium text-slate-500">
                        <span>
                            {loading
                                ? "Comprobando"
                                : `${stagesDone} de ${stageTotal} etapas${errorCount > 0 ? ` · ${errorCount} error${errorCount === 1 ? "" : "es"}` : ""}`}
                        </span>
                        <span className="tabular-nums">{loading ? "" : `${percent}%`}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
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
                    <p className="py-6 text-center text-xs text-rose-600">
                        No se pudieron cargar las incidencias.
                    </p>
                )}
                {!isError && (
                    <ol>
                        <PipelineList steps={steps} complete={!loading && complete} />
                    </ol>
                )}
                {!loading && unmatched.length > 0 && (
                    <div className="mt-2 border-t border-slate-200 pt-3">
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

            <div className="flex flex-wrap gap-x-3 gap-y-1 border-t border-slate-200 px-4 py-2 text-[10px] text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Listo
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500" /> Aviso
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-500" /> Error
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full border border-slate-300 bg-white" /> Sin iniciar
                </span>
            </div>
        </aside>
    )
}

export default KardexProgressPanel
