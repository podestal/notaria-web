import { useState } from "react"
import type { SisgenKardexErrorsResponse } from "../../../services/sisgen/sisgenKardexErrorsService"

type ErrorTabId = "errores" | "observaciones" | "personas"

interface TabConfig {
    id: ErrorTabId
    label: string
    items: string[]
    emptyLabel: string
    itemClassName: string
}

interface Props {
    data: SisgenKardexErrorsResponse
    className?: string
}

const SisgenKardexErrorsPanel = ({ data, className = "" }: Props) => {
    const tabs: TabConfig[] = [
        {
            id: "errores",
            label: "Errores",
            items: data.errores,
            emptyLabel: "Sin errores de validación.",
            itemClassName: "bg-red-50 border-red-200 text-red-800",
        },
        {
            id: "observaciones",
            label: "Observaciones",
            items: data.observaciones,
            emptyLabel: "Sin observaciones.",
            itemClassName: "bg-amber-50 border-amber-200 text-amber-900",
        },
        {
            id: "personas",
            label: "Personas",
            items: data.personas,
            emptyLabel: "Sin incidencias en personas.",
            itemClassName: "bg-slate-50 border-slate-200 text-slate-800",
        },
    ]

    const firstWithItems = tabs.find((t) => t.items.length > 0)?.id ?? "errores"
    const [activeTab, setActiveTab] = useState<ErrorTabId>(firstWithItems)
    const active = tabs.find((t) => t.id === activeTab) ?? tabs[0]

    return (
        <aside
            className={`flex min-h-0 w-full shrink-0 flex-col overflow-hidden border-slate-200 bg-slate-50 xl:border-r ${className}`}
        >
            <div className="border-b border-slate-200 px-4 py-3">
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
                {active.items.length === 0 ? (
                    <p className="text-xs text-slate-500">{active.emptyLabel}</p>
                ) : (
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
