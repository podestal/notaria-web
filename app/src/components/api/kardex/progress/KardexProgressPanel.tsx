import { AlertTriangle, Check, CircleDashed, RefreshCw, X } from "lucide-react"
import { motion } from "framer-motion"
import type { ComplianceKardexErrorsResponse } from "../../../../services/compliance/complianceService"
import {
    buildKardexProgress,
    type ContratantesStage,
    type PatrimonialStageStep,
    type ProgressStatus,
    type ProgressStep,
} from "./kardexProgressModel"

interface Props {
    kardex: string
    idtipkar?: number | null
    data?: ComplianceKardexErrorsResponse
    contratantes?: ContratantesStage | null
    patrimonial?: PatrimonialStageStep[] | null
    participa?: PatrimonialStageStep[] | null
    instrumento?: PatrimonialStageStep[] | null
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

const countIssues = (steps: ProgressStep[], level: "error" | "warning"): number =>
    steps.reduce((total, step) => {
        const here = step.issues.filter((issue) => issue.level === level).length
        return total + here + countIssues(step.children ?? [], level)
    }, 0)

const leafScore = (steps: ProgressStep[]): { done: number; total: number } => {
    let done = 0
    let total = 0
    const walk = (list: ProgressStep[]) => {
        for (const step of list) {
            if (step.children?.length) {
                walk(step.children)
                continue
            }
            total += 1
            if (step.status === "done") done += 1
        }
    }
    walk(steps)
    return { done, total }
}

const NodeIcon = ({ status }: { status: ProgressStatus }) => {
    if (status === "done") return <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
    if (status === "warning") return <AlertTriangle className="h-3 w-3" aria-hidden />
    if (status === "error") return <X className="h-3 w-3" strokeWidth={3} aria-hidden />
    return <CircleDashed className="h-3 w-3" aria-hidden />
}

const Connector = ({ status, active }: { status: ProgressStatus; active: boolean }) => (
    <div className="relative mt-1 w-0.5 flex-1 overflow-hidden rounded-full bg-slate-200">
        <motion.div
            className={`absolute inset-x-0 top-0 origin-top ${LINE[status]}`}
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ duration: 0.45, ease: "easeOut" }}
        />
        {active && status !== "idle" && (
            <span
                className={`pipeline-flow absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full ${FLOW[status]}`}
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
}: {
    step: ProgressStep
    index: number
    nested?: boolean
    isLast?: boolean
}) => {
    const flowing = step.status === "done" || step.status === "warning"

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
                        className={`z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 shadow-sm ${NODE[step.status]} ${
                            nested ? "h-5 w-5" : ""
                        }`}
                        initial={{ scale: 0.6 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 420, damping: 22, delay: index * 0.06 }}
                    >
                        <NodeIcon status={step.status} />
                    </motion.span>
                    {!isLast && <Connector status={step.status} active={flowing} />}
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

                    {step.issues.slice(0, 3).map((issue) => (
                        <p
                            key={`${issue.source ?? ""}-${issue.text}`}
                            className={`mt-1 line-clamp-2 text-[11px] leading-snug ${
                                issue.level === "error" ? "text-rose-700" : "text-amber-800"
                            }`}
                        >
                            {issue.source ? (
                                <span className="mr-1 font-semibold uppercase tracking-wide">
                                    {issue.source}
                                </span>
                            ) : null}
                            {issue.text}
                        </p>
                    ))}
                    {step.issues.length > 3 && (
                        <p className="mt-0.5 text-[10px] text-slate-400">+{step.issues.length - 3} más</p>
                    )}

                    {step.children && step.children.length > 0 && (
                        <ol className="relative mt-3 ml-1 border-l border-dashed border-slate-200 pl-3">
                            {step.children.map((child, childIndex) => (
                                <StepRow
                                    key={child.id}
                                    step={child}
                                    index={index + childIndex + 1}
                                    nested
                                    isLast={childIndex === step.children!.length - 1}
                                />
                            ))}
                        </ol>
                    )}
                </div>
            </div>
        </motion.li>
    )
}

const KardexProgressPanel = ({
    kardex,
    idtipkar,
    data,
    contratantes = null,
    patrimonial = null,
    participa = null,
    instrumento = null,
    isLoading = false,
    isError = false,
    isRefreshing = false,
    onRefresh,
}: Props) => {
    const { steps, unmatched } = buildKardexProgress(
        idtipkar,
        data,
        contratantes,
        patrimonial,
        participa,
        instrumento,
    )
    const errors = countIssues(steps, "error") + unmatched.filter((item) => item.level === "error").length
    const warnings = countIssues(steps, "warning") + unmatched.filter((item) => item.level === "warning").length
    const score = leafScore(steps)
    const percent = score.total === 0 ? 0 : Math.round((score.done / score.total) * 100)

    let summary = "Sin iniciar"
    let summaryClass = "text-slate-500"
    let barClass = "bg-slate-300"
    if (isLoading) {
        summary = "Revisando etapas…"
        barClass = "bg-sky-400"
    } else if (isError) {
        summary = "No se pudo revisar"
        summaryClass = "text-rose-600"
        barClass = "bg-rose-400"
    } else if (data) {
        if (errors > 0) {
            summary = `${errors} error${errors === 1 ? "" : "es"}`
            summaryClass = "text-rose-600"
            barClass = "bg-rose-500"
        } else if (warnings > 0) {
            summary = `${warnings} aviso${warnings === 1 ? "" : "s"}`
            summaryClass = "text-amber-700"
            barClass = "bg-amber-400"
        } else {
            summary = "Sin incidencias"
            summaryClass = "text-emerald-700"
            barClass = "bg-emerald-500"
        }
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
                .pipeline-flow {
                    animation: pipeline-flow 1.6s ease-in-out infinite;
                }
                @keyframes pipeline-bar {
                    0% { transform: translateX(-60%); }
                    100% { transform: translateX(220%); }
                }
                .pipeline-bar-loading {
                    width: 40%;
                    animation: pipeline-bar 1.2s ease-in-out infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .pipeline-flow { animation: none; opacity: 0; }
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
                            onClick={onRefresh}
                            disabled={isRefreshing || isLoading}
                            title="Actualizar avance"
                            className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[10px] font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} aria-hidden />
                            Actualizar
                        </button>
                    )}
                </div>

                <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-[10px] font-medium text-slate-500">
                        <span>{isLoading ? "Comprobando" : `${score.done} de ${score.total} etapas`}</span>
                        <span className="tabular-nums">{isLoading ? "" : `${percent}%`}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                        {isLoading ? (
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
                        {steps.map((step, index) => (
                            <StepRow
                                key={step.id}
                                step={step}
                                index={index}
                                isLast={index === steps.length - 1}
                            />
                        ))}
                    </ol>
                )}
                {!isLoading && unmatched.length > 0 && (
                    <div className="mt-2 border-t border-slate-200 pt-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            Otras incidencias
                        </p>
                        <ul className="mt-2 space-y-1">
                            {unmatched.slice(0, 4).map((issue) => (
                                <li
                                    key={issue.text}
                                    className={`line-clamp-2 text-[11px] leading-snug ${
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
