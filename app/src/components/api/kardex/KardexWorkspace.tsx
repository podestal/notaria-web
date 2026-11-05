import { ReactNode, useState } from "react"
import { Kardex } from "../../../services/api/kardexService"
import useAuthStore from "../../../store/useAuthStore"
import useGetComplianceKardexErrors from "../../../hooks/compliance/useGetComplianceKardexErrors"
import useGetContratantesProgress from "../../../hooks/compliance/useGetContratantesProgress"
import useGetPatrimonialProgress from "../../../hooks/compliance/useGetPatrimonialProgress"
import useGetParticipaProgress from "../../../hooks/compliance/useGetParticipaProgress"
import useGetInstrumentoProgress from "../../../hooks/compliance/useGetInstrumentoProgress"
import KardexLogsPanel from "./KardexLogsPanel"
import ComplianceKardexErrorsPanel from "./kardexErrors/ComplianceKardexErrorsPanel"
import KardexProgressPanel from "./progress/KardexProgressPanel"

type SideView = "progress" | "errors" | "history"

interface Props {
    kardex: Kardex
    isSuperuser: boolean
    enabled?: boolean
    children: ReactNode
}

const VIEWS: { id: SideView; label: string }[] = [
    { id: "progress", label: "Avance" },
    { id: "errors", label: "Errores" },
    { id: "history", label: "Historial" },
]

const KardexWorkspace = ({ kardex, isSuperuser, enabled = true, children }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const [view, setView] = useState<SideView>("progress")
    const sideView: SideView = isSuperuser ? view : "progress"

    const { data, isLoading, isError, refetch, isFetching } = useGetComplianceKardexErrors({
        access,
        kardex: kardex.kardex,
        enabled: enabled && Boolean(kardex.kardex),
    })
    const contratantesQuery = useGetContratantesProgress({
        access,
        kardex: kardex.kardex,
        enabled: enabled && Boolean(kardex.kardex),
    })
    const patrimonialQuery = useGetPatrimonialProgress({
        access,
        kardex: kardex.kardex,
        enabled: enabled && Boolean(kardex.kardex),
    })
    const participaQuery = useGetParticipaProgress({
        access,
        kardex: kardex.kardex,
        enabled: enabled && Boolean(kardex.kardex),
    })
    const instrumentoQuery = useGetInstrumentoProgress({
        access,
        kardex: kardex.kardex,
        enabled: enabled && Boolean(kardex.kardex),
    })
    const isRefreshing =
        (isFetching && !isLoading) ||
        contratantesQuery.isFetching ||
        patrimonialQuery.isFetching ||
        participaQuery.isFetching ||
        instrumentoQuery.isFetching
    const contratantesStage = contratantesQuery.data
        ? {
            status: contratantesQuery.data.status,
            issues: contratantesQuery.data.issues.map((issue) => ({
                level: issue.level,
                text: issue.text,
                source: issue.source,
            })),
        }
        : null
    const patrimonialStage = patrimonialQuery.data
        ? patrimonialQuery.data.steps.map((step) => ({
            id: step.id,
            status: step.status,
            issues: step.issues.map((issue) => ({
                level: issue.level === "warning" ? "warning" as const : "error" as const,
                text: issue.text,
                source: issue.source,
            })),
        }))
        : null
    const participaStage = participaQuery.data
        ? participaQuery.data.steps.map((step) => ({
            id: step.id,
            status: step.status,
            issues: step.issues.map((issue) => ({
                level: issue.level === "warning" ? "warning" as const : "error" as const,
                text: issue.text,
                source: issue.source,
            })),
        }))
        : null
    const instrumentoStage = instrumentoQuery.data
        ? instrumentoQuery.data.steps.map((step) => ({
            id: step.id,
            status: step.status,
            issues: step.issues.map((issue) => ({
                level: issue.level === "warning" ? "warning" as const : "error" as const,
                text: issue.text,
                source: issue.source,
            })),
        }))
        : null
    const refreshAll = () => {
        void refetch()
        void contratantesQuery.refetch()
        void patrimonialQuery.refetch()
        void participaQuery.refetch()
        void instrumentoQuery.refetch()
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row lg:gap-0">
            <div className="flex max-h-[38vh] shrink-0 flex-col lg:max-h-none lg:w-80">
                {isSuperuser && (
                    <div className="mb-2 grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1 lg:mx-0">
                        {VIEWS.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setView(item.id)}
                                className={`cursor-pointer rounded-md px-2 py-1.5 text-[11px] font-semibold transition ${
                                    sideView === item.id
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-500 hover:text-slate-800"
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                )}
                <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-200 lg:rounded-none lg:border-0">
                    {sideView === "progress" && (
                        <KardexProgressPanel
                            kardex={kardex.kardex}
                            idtipkar={kardex.idtipkar}
                            data={data}
                            contratantes={contratantesStage}
                            patrimonial={patrimonialStage}
                            participa={participaStage}
                            instrumento={instrumentoStage}
                            isLoading={
                                isLoading ||
                                contratantesQuery.isLoading ||
                                patrimonialQuery.isLoading ||
                                participaQuery.isLoading ||
                                instrumentoQuery.isLoading
                            }
                            isError={isError}
                            isRefreshing={isRefreshing}
                            onRefresh={refreshAll}
                        />
                    )}
                    {sideView === "errors" && (
                        data ? (
                            <ComplianceKardexErrorsPanel
                                data={data}
                                className="h-full lg:max-h-none"
                                onRefresh={refreshAll}
                                isRefreshing={isRefreshing}
                            />
                        ) : (
                            <aside className="flex h-full min-h-[8rem] items-center justify-center bg-slate-50 p-4 text-xs text-slate-500">
                                {isError ? "No se pudieron cargar los errores." : "Cargando errores…"}
                            </aside>
                        )
                    )}
                    {sideView === "history" && (
                        <KardexLogsPanel
                            idkardex={kardex.idkardex}
                            enabled={enabled}
                            className="h-full lg:max-h-none"
                        />
                    )}
                </div>
            </div>
            <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-auto lg:pl-4">
                {children}
            </main>
        </div>
    )
}

export default KardexWorkspace
