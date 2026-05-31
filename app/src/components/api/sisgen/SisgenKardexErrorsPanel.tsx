import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"
import type { SisgenKardexErrorsResponse } from "../../../services/sisgen/sisgenKardexErrorsService"

type ErrorTabId = "errores" | "observaciones" | "personas"

interface TabConfig {
    id: ErrorTabId
    label: string
    items: string[]
    itemClassName: string
}

interface Props {
    data: SisgenKardexErrorsResponse
    className?: string
    onRefresh: () => void
    isRefreshing?: boolean
}

const SisgenKardexErrorsPanel = ({
    data,
    className = "",
    onRefresh,
    isRefreshing = false,
}: Props) => {
    const tabs: TabConfig[] = [
        {
            id: "errores",
            label: "Errores",
            items: data.errores ?? [],
            itemClassName: "bg-red-50 border-red-200 text-red-800",
        },
        {
            id: "observaciones",
            label: "Observaciones",
            items: data.observaciones ?? [],
            itemClassName: "bg-amber-50 border-amber-200 text-amber-900",
        },
        {
            id: "personas",
            label: "Personas",
            items: data.personas ?? [],
            itemClassName: "bg-slate-50 border-slate-200 text-slate-800",
        },
    ]

    const firstWithItems = tabs.find((t) => t.items.length > 0)?.id ?? "errores"
    const [activeTab, setActiveTab] = useState<ErrorTabId>(firstWithItems)
    const active = tabs.find((t) => t.id === activeTab) ?? tabs[0]

    useEffect(() => {
        const next = tabs.find((t) => t.items.length > 0)?.id
        if (next) setActiveTab(next)
    }, [data.sisgen_error_count, data.errores.length, data.observaciones.length, data.personas.length])

    return (
        <aside
            className={`flex min-h-0 w-full shrink-0 flex-col overflow-hidden border-slate-200 bg-slate-50 xl:border-r ${className}`}
        >
            <div className="border-b border-slate-200 px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                            Validación SISGEN
                        </p>
                        <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                            {data.kardex}
                        </p>
                        <p
                            className={`mt-1 text-xs font-semibold ${
                                data.sisgen_error_count > 0
                                    ? "text-red-600"
                                    : "text-green-600"
                            }`}
                        >
                            {data.sisgen_error_count === 0
                                ? "Sin incidencias"
                                : data.sisgen_error_count === 1
                                  ? "1 incidencia"
                                  : `${data.sisgen_error_count} incidencias`}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        title="Volver a validar el kardex ante SISGEN"
                        className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[10px] font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw
                            className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
                            aria-hidden
                        />
                        Verificar
                    </button>
                </div>
            </div>

            <nav className="flex flex-col gap-1 p-2" aria-label="Categorías de errores SISGEN">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                            activeTab === tab.id
                                ? "bg-blue-600 text-white shadow-sm"
                                : "bg-white text-slate-700 hover:bg-slate-100"
                        }`}
                    >
                        <span>{tab.label}</span>
                        <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                                activeTab === tab.id
                                    ? "bg-blue-500 text-white"
                                    : "bg-slate-200 text-slate-700"
                            }`}
                        >
                            {tab.items.length}
                        </span>
                    </button>
                ))}
            </nav>

            <div className="min-h-0 flex-1 overflow-y-auto p-3">
                <p className="mb-2 text-[10px] font-semibold uppercase text-slate-500">
                    {active.label}
                </p>
                {active.items.length > 0 && (
                    <ul className="space-y-2">
                        {active.items.map((item, idx) => (
                            <li
                                key={`${active.id}-${idx}`}
                                className={`rounded-md border px-2.5 py-2 text-xs leading-snug ${active.itemClassName}`}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </aside>
    )
}

export default SisgenKardexErrorsPanel
